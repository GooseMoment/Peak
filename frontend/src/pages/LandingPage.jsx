import { NavLink } from "react-router-dom"

import LandingRoot from "@components/landing/LandingRoot"
import TaskCreateDetail from "@pages/taskCreates/TaskCreateDetail"

import logo from "@assets/logo.svg"
import projectComplete from "@assets/landing/undraw_project_complete_lwss.svg"
import buddies from "@assets/landing/undraw_buddies_2ae5.svg"
import speedTest from "@assets/landing/undraw_speed_test_re_pe1f.svg"
import graphs from "@assets/landing/graphs.svg"


const LandingPage = () => {
    return <LandingRoot>
    <nav>
    <div className="left">
        <img className="icon" src={logo} />
        <h1>Peak <span className="by">by GooseMoment</span></h1>
    </div>
    <div className="right">
        <a className="ext-link" href="https://blog.peak.ooo">Blog</a>
        <a className="ext-link" href="https://support.peak.ooo">Support</a>
        <NavLink to="/sign"><button className="start-now">Start Now</button></NavLink>
    </div>
    </nav> 
    <section>
    <div className="first">
        <h2 className="catchpraise">Plan, Organize and Cheer.</h2>
        <p>
            Empower productivity with the ability to plan tasks, organize projects,
            <wbr/> 
            and cheer on your peers' progress, all in one convenient app.
        </p>
        <NavLink to="/sign"><button className="start-now">Start Now</button></NavLink>
    </div>
    <article>
        <div className="left">
            <div className="texts">
                <h2>작업을 추가하세요.</h2>
                <p>
                    집안일부터 학교 일, 회사 일까지<wbr/> 전부 Peak에 추가하세요.
                </p>
            </div>
            <img className="second" src="./img/tasks.svg" />
        </div>
        <div className="right" onClickCapture={e => e.stopPropagation()}>
        <   TaskCreateDetail task={{completd: false, name: "집안일 하기"}} />
        </div>
    </article>
    <article>
        <div className="left">
            <div className="texts">
            <h2>프로젝트별로 관리하세요.</h2>
            <p>
                꾸준히 할 일이 쌓이는 프로젝트와
                <wbr/>
                목표가 뚜렷한 프로젝트를 나눠 설정하세요.
            </p>
            </div>
            <img className="second" src={projectComplete} />
        </div>
        <img className="right" src="./img/project-create.svg" />
    </article>
    <article>
        <div className="left">
            <div className="texts">
            <h2>친구와 함께 성장하세요.</h2>
            <p>
                혼자 역경을 해쳐나가는 것과 함께 나아가는 건 천지 차이.
                <wbr/>
                다른 사람들과 진행 상황을 공유하고 응원을 주고 받으세요.
            </p>
            </div>
            <img className="second buddies" src={buddies} />
        </div>
        <img className="right" src="./img/daily-log.svg" />
    </article>
    <article>
        <div className="left">
            <div className="texts">
            <h2>광고 없는, 빠른 실행 속도.</h2>
            <p>
                느린 로딩 시간? 광고? 앱 열다가 할 일 잊기는 그만.
                <wbr/>
                방해받지 않고 작업을 모두 추가하세요.
            </p>
            </div>
            <img className="second" src={speedTest} />
        </div>
        <img className="right" src={graphs} />
    </article>
    </section>
    <div className="last">
        <article>
            <h2>손쉽게 지금 시작하세요.</h2>
            <NavLink to="/sign"><button className="start-now">Start Now</button></NavLink>
            <p>스토어 출시 준비 중</p>
        </article>
        <footer>
            <h3><span className="brand">Peak</span> by GooseMoment</h3>
            <p>(유)구스피 전라남도 순천시 **길 ** ***동 ****호
                <wbr/>
                | 개인정보 책임 *** 
                <wbr/>
                | 대표 이메일 support at peak dot ooo
            </p>
        </footer>
    </div>
    </LandingRoot>
}

export default LandingPage