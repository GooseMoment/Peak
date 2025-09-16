import AddTask from "@components/home/AddTask"
import AllowNotification from "@components/home/AllowNotification"
import AssignedToday from "@components/home/AssignedToday"
import Header from "@components/home/Header"
import InstallPeak from "@components/home/InstallPeak"
import SetProfileImg from "@components/home/SetProfileImg"

const HomePage = () => {
    return (
        <>
            <Header />
            <AddTask />
            <AllowNotification />
            <SetProfileImg />
            <InstallPeak />
            <AssignedToday />
        </>
    )
}

export default HomePage
