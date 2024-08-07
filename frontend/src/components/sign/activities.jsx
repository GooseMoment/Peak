import Activity, { Emoji } from "@components/sign/Activity"

import GraphemeSplitter from "grapheme-splitter"

const pick = (array) => {
    const random = Math.floor(Math.random() * array.length)
    return array[random]
}

const usernames = [
    "andless2004",
    "dksgo",
    "jedbeom",
    "minyoy",
    "aksae",
    // TODO: more usernames
    "haruka",
    "miki",
    "chihaya",
    "iori",
    "yayoi",
    "hibiki",
    "ami",
    "mami",
    "makoto",
    "takane",
    "ritsuko",
    "azusa",
    "yukiho",
]

const splitter = new GraphemeSplitter()

const emojis_str =
    "😀😃😄😁😆😅😂🤣🥲🥹☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😮‍💨😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🫣🤗🫡🤔🫢🤭🤫🤥😶😶‍🌫️😐😑😬🫨🫠🙄😯😦😧😮😲🥱😴🤤😪😵😵‍💫🫥🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺😸😹😻😼😽🙀😿😾" +
    "👋🤚🖐✋🖖👌🤌🤏✌️🤞🫰🤟🤘🤙🫵🫱🫲🫸🫷🫳🫴👈👉👆🖕👇☝️👍👎✊👊🤛🤜👏🫶🙌👐🤲🤝🙏✍️💅🤳💪🦾🦵🦿🦶👣👂🦻👃🫀🫁🧠"

const systemEmojis = splitter.splitGraphemes(emojis_str)

const tasks = [
    "교환학생 Application",
    "한미첨단분야지원교류어쩌고",
    "과외 준비",
    "스터디 회합",
    "저녁 먹고 설거지",
    "아침 - 플레인 스콘에 우유",
    "간식 - 아아, 킷캣, 요구르트",
    "도쿄여행 계획 짜기",
    "사진 하드에 옮기기",
    "독서모임 10분 독서 인증",
    "동생 졸업선물 구매",
    "월급 받음!!!!!",
    "알바 풀타임",
    "아침 - 떡국",
    "물 2L",
    "드디어 집 가요",
    "생.선 챙기기",
    "언니 생.선 챙기기",
    "짐 챙기기",
    "젤다 미니퀘스트 다 깨자... 절반만 깨자... 그 절반만",
    "블로그 쓸 사진 추리기",
    "블로그 쓰기",
    "점심은 양념삼겹~",
    "구스모멘트",
    "수험표 챙겨",
    "인권과 성평등 들었나...? 들었다",
    "육비",
    "수희등 결과... 겨우 3학점?",
    "강릉 여행 계획!!",
    "아이쿠 친목조",
    "듀오링고&말해보카",
    "회비 정리",
    "헬스장",
    "방재실에 전화",
    "드디어 새터 출발",
    "인편",
    "12시 50분에 점호하러",
    "21시 반 층장 인수인계",
    "현대문학 01. 완장, 도도한 생활",
    "완자 생1 3-1 중단원 마무리 & 수능 실전 문제",
    "수특 물2 04. 일반 상대성 이론 2점",
    "현대문학 실전문제 02. 거제도 둔덕골 ~ 사무원",
    "2과 학습지 훑고 해석 달기",
    "토, 일, 월 계획하기",
    "심화수학의 날",
    "ㅅㅂㅈ T26. 부정적분의 계산",
    "대수 과제 끝내기",
    "아유 하기 싫어",
    "저녁 뭐먹지",
    "C공부 2",
    "토익 | LC 4회",
    "이공편수 2. 미적분(상) | 정리 (적분 - 무한급수와 정적분)",
    "형법총론 읽기",
    "영어필사 책 + 노트 사기",
    "감기약 사기",
    "캔들용 라이터 사기",
]

const projects = [
    "할일",
    "과제",
    "공부",
    "집안일",
    "루틴",
    "문화",
    "개발",
    "수학 1 & 2",
    "영어",
    "심수 2",
    "미적분과 기하",
    "Things I gonna do",
    "Be healty",
    "Personal report",
    "Study",
    "Study Abroad",
    "School life",
    "Go Further",
    "Part-time job",
    "Server management",
    "Household",
    "Body",
    "My life",
    "할일💯🔥",
    "공부/업무",
    "여가",
    "과제&공부",
    "알바",
]

const comments = [
    "아ㅏㅏ 공부하기 싫어",
    "젤다깨고만다",
    "개발은 언제 끝나는걸까",
    "난 구영서야",
    "오늘 하루는 참...",
    // TODO: add comments
]

const timeUnitsMap = {
    seconds: 59 - 2,
    minutes: 59 - 2,
    hours: 23 - 2,
    days: 29 - 2,
    months: 11 - 2,
}

const generateActivities = (serverEmojis) => {
    let emojis = serverEmojis

    if (!serverEmojis) {
        emojis = systemEmojis
    }

    const verbDetailMap = {
        reacted: emojis,
        "completed a task": tasks,
        "made a task": tasks,
        "made a project": projects,
        "put today's comment": comments,
    }

    let activities = []

    for (let i = 0; i < 20; i++) {
        const username = pick(usernames)

        let verb = pick(Object.keys(verbDetailMap))
        if (Math.random() < 0.25) {
            verb = "reacted"
        }

        let detail = pick(verbDetailMap[verb])
        if (detail?.name) {
            detail = <Emoji src={detail.img_uri} />
        }

        const timeUnit = pick(Object.keys(timeUnitsMap))
        const timeValue = Math.floor(Math.random() * timeUnitsMap[timeUnit]) + 2
        activities.push(
            <Activity
                key={`activity-${i}`}
                action={"@" + username + " " + verb}
                detail={detail}
                ago={timeValue + " " + timeUnit + " ago"}
            />,
        )
    }

    return activities
}

export default generateActivities
