import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

// from: https://zwbetz.com/create-react-app-show-current-git-branch-and-commit-hash-from-any-os/

const execSyncWrapper = (command) => {
    let stdout = null
    try {
        stdout = execSync(command).toString().trim()
    } catch (error) {
        console.error(error)
    }
    return stdout
}

const main = () => {
    let gitBranch = execSyncWrapper('git rev-parse --abbrev-ref HEAD')
    let gitCommitHash = execSyncWrapper('git rev-parse --short=7 HEAD')

    const obj = {
        gitBranch,
        gitCommitHash
    }

    const filePath = resolve('src', 'generatedGitInfo.json')
    const fileContents = JSON.stringify(obj, null, 2)

    writeFileSync(filePath, fileContents)
    console.log(`Wrote the following contents to ${filePath}\n${fileContents}`)
}

main()
