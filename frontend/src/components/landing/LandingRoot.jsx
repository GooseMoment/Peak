import styled from "styled-components"

const background = "#FFD7C7"
const goose = "#FE4902"

const LandingRoot = styled.div`
position: relative;
width: 100%;
height: 100%;

& button {
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
}

& button:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow .2s;
}

& button:active {
    background-color: #F7F7F7;
    border-color: #000000;
    transform: scale(.86);
}

& button:disabled {
    border-color: #DDDDDD;
    color: #DDDDDD;
    cursor: not-allowed;
    opacity: 1;
}

& button.start-now {
    background-color: #FE4902;
    color: white;
    border-color: #FE4902;
}

/* nav */

& nav {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 999;

    display: flex;
    justify-content: space-between;

    padding: 0.5em 1.5em 0.5em 1em;

    font-size: 1rem;

    background-color: #FEFDFC;


    & div {
        display: flex;
        gap: 0.5em;
        font-size: 16px;
        align-items: center
    }

    & .left h1 {
        font-size: 16px;
        font-weight: 700;
    }

    & .left img {
        height: 2rem;
    }

    & span.by {
        font-weight: 300;
    }

    & .right {
        gap: 1rem;
    }

    & a {
        text-decoration: none;
        color: inherit;
    }
}


@media screen and (max-width: 800px) {
    & nav span.by {
        display: none;
    }
}

& section {
    position: relative;
}

/* articles */

& article {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;

    position: relative;
    padding: 4rem;
    padding-top: 5rem;
    border-top: solid 0.75em rgb(255, 230, 230);

    word-break: keep-all;

    & h2 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    & .left {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        max-width: 50%;
    }

    & img {
        width: min(35vw, 100%);
        
        &.second {
            width: 30vw;
        }
    }
}

@media screen and (max-width: 950px) {
    & article {
        justify-content: center;

        padding: 2rem;


        & .left {
            max-width: unset;

            align-items: center;
        }

        & .texts {
            text-align: center;
        }

        & h2 {
            font-size: 2rem;
        }

        & p {
            font-size: 1rem;
        }

        & img {
            width: 80%;
        }

        & .second, & .right {
            width: min(90%, 700px);
        }
    }
}

/* article 1 */

& .first {
    background-color: ${background};
    color: ${goose};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;

    padding: 2rem;

    height: 50rem;

    border: none;


    & button {
        margin-top: 50px;
    }

    & h2 {
        font-size: 50px;
        line-height: 1em;
        font-weight: bold;
    }

    & button {
        font-size: 1.25rem;
    }
}

/* special arrangement */
& img.buddies {
    width: 80%;
}

/* last */

& .last {
    background: linear-gradient(180deg, rgba(252, 245, 238, 0) 0%, #FCF5EE 10%);
    padding: 1em;
    padding-top: 5em;

    & article {
        display: block;

        border-top: none;
        text-align: center;
        padding-top: 10rem;
    }

    & article p {
        margin-top: 2rem;
        color: grey;
        font-size: 1rem;
    }
}


footer {
    border-top: solid 0.1rem black;
    margin: 10rem 1rem 0 1rem;
    padding: 1rem 0;

    & p {
        margin-top: 0.5rem;
        font-size: 0.75rem;
    }

    & h3 {
        font-weight: 300;
    }

    & h3 span {
        font-weight: 700;
    }
}
`

export default LandingRoot