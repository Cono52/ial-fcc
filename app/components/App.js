import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: black;
  font-family: 'Nunito', sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.div`
  opacity: 0;
  animation: ${fadeIn} 0.5s 0.1s ease-in forwards;
  color: white;
  font-size: ${props => props.big ? '1.55em' : '1em'};
  max-width: 30em;
  min-width: 10em;
  ${props => props.big ? 'text-align: center; font-weight: bold' : ''};
  

  .code {
    background-color: #2e2e2e;
    word-wrap: break-word;
    padding: 0.5em;
    border-radius: 6px;
    
    a {
      text-decoration: none;
      color: orange;
      transition: color 0.1s ease-in-out;
    }
    
    a:hover {
      color: blue;
    }
  }

  @media (max-width: 420px) {
    font-size: ${props => props.big ? '1.35em' : '0.8em'};
    max-width: 25em;
    min-width: 8em;
  }

`;

/* the main page for the index route of this app */
const App = () =>  {
    return ( 
      <Container>
        <TextContainer big>
          <p>{`This is an image search abstraction layer of youtube's search api.`}</p>
        </TextContainer>
        <TextContainer>
          <p>Get list of past queries:</p>
          <p className='code'>https://ial-fcc.glitch.me/api/latest/imagesearch</p>
          <p>Usage:</p>
          <p className='code'>{`https://ial-fcc.glitch.me/api/imagesearch/<search term>?offset=<page number of results>`}</p>
          <p>Example:</p>
          <p className='code'>{`https://ial-fcc.glitch.me/api/imagesearch/funny dog?offset=2`}</p>
        </TextContainer>
      </Container>
    )
}

export default App;