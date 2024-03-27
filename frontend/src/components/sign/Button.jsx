import styled from "styled-components"

const Button = styled.button`
    background-color: #FFFFFF;
    border: 1px solid #222222;
    border-radius: 10px;
    box-sizing: border-box;
    color: #222222;
    cursor: pointer;
    display: inline-block;
    font-weight: 600;
    line-height: 20px;
    margin: 0;
    outline: none;
    padding: 0.5em 1em;
    position: relative;
    text-align: center;
    text-decoration: none;
    touch-action: manipulation;
    transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
    user-select: none;
    -webkit-user-select: none;
    width: auto;
    
    &:focus-visible {
        box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
        transition: box-shadow .2s;
    }

    &:active:hover:not([disabled]) {
        background-color: #F7F7F7;
        border-color: #000000;
        transform: scale(.86);
    }

    &:disabled {
        border-color: #DDDDDD;
        color: #DDDDDD;
        cursor: not-allowed;
        opacity: 1;
    }
`

export default Button