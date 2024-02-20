import { Link, useRouteError } from "react-router-dom"
import Layout from "@/containers/Layout"
import { Component, useState } from "react"
import FeatherIcon from "feather-icons-react";

import TaskName from "@/components/project/TaskName"
import styled from "styled-components";
import Drawer from "@/components/project/Drawer";

const TitleBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const TitleName = styled.h1`
    font-size: 2em;
    font-weight: bolder;
    text-align: left;
    color: #0031E0;
`

const TaskList = styled.div`
    flex: 1;
    padding: 12px;
    overflow-y: auto;
`

const TaskCreateButton = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    vertical-align: center;
    text-align: middle;
    margin-left: 0.8em;
    margin-top: 0.5em;

    & .h1 {
        text-align: center;
        font-size: 1.1em;
        font-weight: bold;
        color: #000000;
    }

    & .feather {
        text-align: center;
        width: 1.3em;
        height: 1.3em;
    } 
`

const ProjectPage = () => {
    return (
    <>
        <TitleBox>
            <TitleName>홍대라이프</TitleName>
            <FeatherIcon icon="more-horizontal"/>
        </TitleBox>
        <Drawer name="수강신청" color="#2E61DC"></Drawer>
        <TaskList>
            <TaskName text="수강신청" done={false} day="01월 30일"/>
            <TaskName text="담아두기" done={true} day="02월 20일"/>
        </TaskList>
        <TaskCreateButton>
            <FeatherIcon icon="plus-circle"/>
            <h1>할 일 추가</h1>
        </TaskCreateButton>
    </>
    )
}

export default ProjectPage