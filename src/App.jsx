import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [downloadLink, setDownloadLink] = useState([])

  function convertFile(e) {
    //console.log(e)

    let reader = new FileReader()

    reader.readAsText(e.target.files[0])

    reader.onload = () => {
        let pygConverted = {"chat": ["You: ..."]}
        const result = reader.result
        const json = JSON.parse(result)
        //console.log(json)
        let messages = json.histories.histories[0].msgs
        let characterName = json.info.character.name
        //console.log(messages)

        let previous_is_human = false;

        for(let i = 0; i < messages.length; i++) {
            let message = messages[i].text
            let result = message.replace(/\n/gm, ' ')
            result = result.replace('  ', ' ')

            if(messages[i].tgt.is_human === true) {
                if(previous_is_human === true) {
                  pygConverted.chat.push("You: ...")
                }
                result = characterName + ": " + result
            } else {
                result = "You: " + result
            }
            pygConverted.chat.push(result)

            previous_is_human = messages[i].tgt.is_human
        }
        //console.log(pygConverted)

        const blob = new Blob([JSON.stringify(pygConverted)], {type:"json"})
        const href = URL.createObjectURL(blob)

        setDownloadLink([href])
    }
  }

  return (
    <div className="App w-screen h-screen bg-gray-300 max-w-full">
      <div className="max-w-screen-xl bg-gray-100 mx-auto" id="main">
        <h1 className='text-center py-8 text-3xl'>Character.AI to Pygmallion chat converter</h1>
        <div className="max-w-full relative w-96 max-w-screen h-16 rounded-md border-2 border-gray-300 mx-auto flex items-center justify-center hover:bg-gray-200 cursor-pointer">
          <h2 className='text-center text-xl text-gray-500 select-none cursor-pointer'>Upload your .JSON file here</h2>
          <input onChange={convertFile} type="file" name="" id="" className='opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer' />
        </div>
        {downloadLink.map((link, index) => {
          return (
            <p className='text-center py-5'><a download="convo.json" href={link} key={index}>Download converted file</a></p>
          )
        })}
      </div>
    </div>
  )
}

export default App
