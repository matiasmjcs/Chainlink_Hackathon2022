import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
          <div className='footer__div'>
              <p>this project was built for the chainlink hackathon year 2022</p>
               <br />
              name:
              <a className='footer__a' Target="_blank" href='https://linkedin.com/in/matias-mejias-cisternas'>  Matías Ignacio Mejías Cisternas</a> <br /> <br />
              contact:
              <a className='footer__a' Target="_blank" href='mailto:matiasignaciomejiascisternas@gmail.com'> matiasmejiascisternas@gmail.com</a><br /> <br />
              repository:

              <a className='footer__a' Target="_blank" href='https://github.com/matiasmjcs/Chainlink_Hackathon2022.git'> Github </a>
          </div>
    </footer>
  )
}

export default Footer