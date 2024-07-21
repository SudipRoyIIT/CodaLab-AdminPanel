import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 200px;
  height: 150px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 0.9em;
  color: #666;
`;

const Card = ({ title, description }) => {
  return (
    <CardContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </CardContainer>
  );
};

export default Card;
