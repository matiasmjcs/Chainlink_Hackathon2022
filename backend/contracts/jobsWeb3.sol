// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

contract jobsWeb3 {
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(owner == msg.sender);
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

    function postWorkPremium(
        string memory _MarketStall,
        string memory _business,
        string memory _country,
        string memory _description,
        uint256 _vacancies,
        uint256 _salary,
        string memory _Contact
    ) public  {
        

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

    function restarting() public {
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


    function withdraw() public payable onlyOwner {
        require(owner.send(address(this).balance));
    }
}
