// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;
pragma experimental ABIEncoderV2;
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract jobsWeb3 is  KeeperCompatibleInterface, ConfirmedOwner, Pausable{
    address payable Owner;


    constructor(address keeperRegistryAddress, uint256 minWaitPeriodSeconds) ConfirmedOwner(msg.sender) {
    setKeeperRegistryAddress(keeperRegistryAddress);
    setMinWaitPeriodSeconds(minWaitPeriodSeconds);
        Owner = payable(msg.sender);

  }


    // observed limit of 45K + 10k buffer
  uint256 private constant MIN_GAS_FOR_TRANSFER = 55_000;

  event FundsAdded(uint256 amountAdded, uint256 newBalance, address sender);
  event FundsWithdrawn(uint256 amountWithdrawn, address payee);
  event TopUpSucceeded(address indexed recipient);
  event TopUpFailed(address indexed recipient);
  event KeeperRegistryAddressUpdated(address oldAddress, address newAddress);
  event MinWaitPeriodUpdated(uint256 oldMinWaitPeriod, uint256 newMinWaitPeriod);

  error InvalidWatchList();
  error OnlyKeeperRegistry();
  error DuplicateAddress(address duplicate);

  struct Target {
    bool isActive;
    uint96 minBalanceWei;
    uint96 topUpAmountWei;
    uint56 lastTopUpTimestamp; // enough space for 2 trillion years
  }

  address private s_keeperRegistryAddress;
  uint256 private s_minWaitPeriodSeconds;
  address[] private s_watchList;
  mapping(address => Target) internal s_targets;

  /**
   * @param keeperRegistryAddress The address of the keeper registry contract
   * @param minWaitPeriodSeconds The minimum wait period for addresses between funding
   */
  

  /**
   * @notice Sets the list of addresses to watch and their funding parameters
   * @param addresses the list of addresses to watch
   * @param minBalancesWei the minimum balances for each address
   * @param topUpAmountsWei the amount to top up each address
   */
  function setWatchList(
    address[] calldata addresses,
    uint96[] calldata minBalancesWei,
    uint96[] calldata topUpAmountsWei
  ) external onlyOwner {
    if (addresses.length != minBalancesWei.length || addresses.length != topUpAmountsWei.length) {
      revert InvalidWatchList();
    }
    address[] memory oldWatchList = s_watchList;
    for (uint256 idx = 0; idx < oldWatchList.length; idx++) {
      s_targets[oldWatchList[idx]].isActive = false;
    }
    for (uint256 idx = 0; idx < addresses.length; idx++) {
      if (s_targets[addresses[idx]].isActive) {
        revert DuplicateAddress(addresses[idx]);
      }
      if (addresses[idx] == address(0)) {
        revert InvalidWatchList();
      }
      if (topUpAmountsWei[idx] == 0) {
        revert InvalidWatchList();
      }
      s_targets[addresses[idx]] = Target({
        isActive: true,
        minBalanceWei: minBalancesWei[idx],
        topUpAmountWei: topUpAmountsWei[idx],
        lastTopUpTimestamp: 0
      });
    }
    s_watchList = addresses;
  }

  /**
   * @notice Gets a list of addresses that are under funded
   * @return list of addresses that are underfunded
   */
  function getUnderfundedAddresses() public view returns (address[] memory) {
    address[] memory watchList = s_watchList;
    address[] memory needsFunding = new address[](watchList.length);
    uint256 count = 0;
    uint256 minWaitPeriod = s_minWaitPeriodSeconds;
    uint256 balance = address(this).balance;
    Target memory target;
    for (uint256 idx = 0; idx < watchList.length; idx++) {
      target = s_targets[watchList[idx]];
      if (
        target.lastTopUpTimestamp + minWaitPeriod <= block.timestamp &&
        balance >= target.topUpAmountWei &&
        watchList[idx].balance < target.minBalanceWei
      ) {
        needsFunding[count] = watchList[idx];
        count++;
        balance -= target.topUpAmountWei;
      }
    }
    if (count != watchList.length) {
      assembly {
        mstore(needsFunding, count)
      }
    }
    return needsFunding;
  }

  /**
   * @notice Send funds to the addresses provided
   * @param needsFunding the list of addresses to fund (addresses must be pre-approved)
   */
  function topUp(address[] memory needsFunding) public whenNotPaused {
    uint256 minWaitPeriodSeconds = s_minWaitPeriodSeconds;
    Target memory target;
    for (uint256 idx = 0; idx < needsFunding.length; idx++) {
      target = s_targets[needsFunding[idx]];
      if (
        target.isActive &&
        target.lastTopUpTimestamp + minWaitPeriodSeconds <= block.timestamp &&
        needsFunding[idx].balance < target.minBalanceWei
      ) {
        bool success = payable(needsFunding[idx]).send(target.topUpAmountWei);
        if (success) {
          s_targets[needsFunding[idx]].lastTopUpTimestamp = uint56(block.timestamp);
          emit TopUpSucceeded(needsFunding[idx]);
        } else {
          emit TopUpFailed(needsFunding[idx]);
        }
      }
      if (gasleft() < MIN_GAS_FOR_TRANSFER) {
        return;
      }
    }
  }

  /**
   * @notice Get list of addresses that are underfunded and return keeper-compatible payload
   * @return upkeepNeeded signals if upkeep is needed, performData is an abi encoded list of addresses that need funds
   */
  function checkUpkeep(bytes calldata)
    external
    view
    override
    whenNotPaused
    returns (bool upkeepNeeded, bytes memory performData)
  {
    address[] memory needsFunding = getUnderfundedAddresses();
    upkeepNeeded = needsFunding.length > 0;
    performData = abi.encode(needsFunding);
    return (upkeepNeeded, performData);
  }

  /**
   * @notice Called by keeper to send funds to underfunded addresses
   * @param performData The abi encoded list of addresses to fund
   */
  function performUpkeep(bytes calldata performData) external override onlyKeeperRegistry whenNotPaused {
    address[] memory needsFunding = abi.decode(performData, (address[]));
    topUp(needsFunding);
  }

  /**
   * @notice Withdraws the contract balance
   * @param amount The amount of eth (in wei) to withdraw
   * @param payee The address to pay
   */
  function withdraw(uint256 amount, address payable payee) external onlyOwner {
    require(payee != address(0));
    emit FundsWithdrawn(amount, payee);
    payee.transfer(amount);
  }

  /**
   * @notice Receive funds
   */
  receive() external payable {
    emit FundsAdded(msg.value, address(this).balance, msg.sender);
  }

  /**
   * @notice Sets the keeper registry address
   */
  function setKeeperRegistryAddress(address keeperRegistryAddress) public onlyOwner {
    require(keeperRegistryAddress != address(0));
    emit KeeperRegistryAddressUpdated(s_keeperRegistryAddress, keeperRegistryAddress);
    s_keeperRegistryAddress = keeperRegistryAddress;
  }

  /**
   * @notice Sets the minimum wait period (in seconds) for addresses between funding
   */
  function setMinWaitPeriodSeconds(uint256 period) public onlyOwner {
    emit MinWaitPeriodUpdated(s_minWaitPeriodSeconds, period);
    s_minWaitPeriodSeconds = period;
  }

  /**
   * @notice Gets the keeper registry address
   */
  function getKeeperRegistryAddress() external view returns (address keeperRegistryAddress) {
    return s_keeperRegistryAddress;
  }

  /**
   * @notice Gets the minimum wait period
   */
  function getMinWaitPeriodSeconds() external view returns (uint256) {
    return s_minWaitPeriodSeconds;
  }

  /**
   * @notice Gets the list of addresses being watched
   */
  function getWatchList() external view returns (address[] memory) {
    return s_watchList;
  }

  /**
   * @notice Gets configuration information for an address on the watchlist
   */
  function getAccountInfo(address targetAddress)
    external
    view
    returns (
      bool isActive,
      uint96 minBalanceWei,
      uint96 topUpAmountWei,
      uint56 lastTopUpTimestamp
    )
  {
    Target memory target = s_targets[targetAddress];
    return (target.isActive, target.minBalanceWei, target.topUpAmountWei, target.lastTopUpTimestamp);
  }

  /**
   * @notice Pauses the contract, which prevents executing performUpkeep
   */
  function pause() external onlyOwner {
    _pause();
  }

  /**
   * @notice Unpauses the contract
   */
  function unpause() external onlyOwner {
    _unpause();
  }

  modifier onlyKeeperRegistry() {
    if (msg.sender != s_keeperRegistryAddress) {
      revert OnlyKeeperRegistry();
    }
    _;
  }

    struct work {
        string MarketStall;
        string business;
        string country;
        string description;
        uint256 vacancies;
        uint256 salary;
        string Contact;
        bytes32 id;
        address[] applicants;
    }

    event newJob(
        string MarketStall,
        string business,
        string country,
        string description,
        uint256 vacancies,
        uint256 salary,
        string Contact,
        bytes32 id
    );

    struct profesional {
        string name;
        string surname;
        string presentationLetter;
        string email;
        string portfolio;
        string linkedin;
    }

    event newProfesional(
        string name,
        string surname,
        string presentationLetter,
        string email,
        string portfolio,
        string linkedin
    );

    work[] jobs;

    work[] jobsPremium;

    work[] _jobspremium;

    address[] postulant;

    mapping(bytes32 => work) public seeWork;

    mapping(address => profesional) public seeProfesionales;

    function postWork(
        string memory _MarketStall,
        string memory _business,
        string memory _country,
        string memory _description,
        uint256 _vacancies,
        uint256 _salary,
        string memory _Contact
    ) public 
     {
        

        bytes32 _id = keccak256(
            abi.encodePacked(
                _description,
                _MarketStall,
                _salary,
                _vacancies,
                _Contact
            )
        );

        jobs.push(
            work(
                _MarketStall,
                _business,
                _country,
                _description,
                _vacancies,
                _salary,
                _Contact,
                _id,
                postulant
            )
        );

        seeWork[_id] = work(
            _MarketStall,
            _business,
            _country,
            _description,
            _vacancies,
            _salary,
            _Contact,
            _id,
            postulant
        );

        emit newJob(
            _MarketStall,
            _business,
            _country,
            _description,
            _vacancies,
            _salary,
            _Contact,
            _id
        );
    }

    function postWorkPremium (
        string memory _MarketStall,
        string memory _business,
        string memory _country,
        string memory _description,
        uint256 _vacancies,
        uint256 _salary,
        string memory _Contact
    ) public  payable{
        
        require( msg.value == 200000000000000000 wei);
        bytes32 _id = keccak256(
            abi.encodePacked(
                _description,
                _MarketStall,
                _salary,
                _vacancies,
                _Contact
            )
        );

        jobsPremium.push(
            work(
                _MarketStall,
                _business,
                _country,
                _description,
                _vacancies,
                _salary,
                _Contact,
                _id,
                postulant
            )
        );

        seeWork[_id] = work(
            _MarketStall,
            _business,
            _country,
            _description,
            _vacancies,
            _salary,
            _Contact,
            _id,
            postulant
        );

        emit newJob(
            _MarketStall,
            _business,
            _country,
            _description,
            _vacancies,
            _salary,
            _Contact,
            _id
        );
    }

    function registerProfesional(
        string memory _name,
        string memory _surname,
        string memory _presentationLetter,
        string memory _email,
        string memory _portfolio,
        string memory _linkedin
    ) public {
        
        seeProfesionales[msg.sender] = profesional(
            _name,
            _surname,
            _presentationLetter,
            _email,
            _portfolio,
            _linkedin
        );

        emit newProfesional(
            _name,
            _surname,
            _presentationLetter,
            _email,
            _portfolio,
            _linkedin
        );
    }

    function postulate(bytes32 _ID) public {
        work storage _trabajo = seeWork[_ID];
        _trabajo.applicants.push(msg.sender);
        _trabajo = seeWork[_ID];
    }

    function returnjobs() public view returns (work[] memory) {
        return jobs;
    }

    function returnjobsPremium() public view returns (work[] memory) {
        return jobsPremium;
    }

    function restarting() public onlyKeeperRegistry {
        jobsPremium = _jobspremium;
    }

    function returnpostulant(bytes32 _id)
        public
        view
        returns (address[] memory)
    {
        work memory _trabajo = seeWork[_id];
        address[] memory _postulant = _trabajo.applicants;
        return _postulant;
    }


    function withdraw() public payable  {
        require(Owner.send(address(this).balance));
    }
}