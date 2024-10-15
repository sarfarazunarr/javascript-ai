import { useEffect, useRef, useState } from 'react'
import './App.css'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

function App() {
  const [data, setData] = useState({
    mode: "",
    prompt: ""
  })
  const responseref = useRef(null)
  const [response, setResponse] = useState("");
  const [placeholder, setPlaceholder] = useState("")
  const [pending, setPending] = useState(false);
  useEffect(() => {
    switch (data.mode.toLowerCase()) {
      case "explain":
        setPlaceholder("Enter Code to explain!")
        break;
      case "generate":
        setPlaceholder("What do you want to generate?")
        break;
      case "modify":
        setPlaceholder("Enter Code and problem to modify code!")
        break;
      default:
        setPlaceholder("")
    }
  }, [data.mode])


  const generateContent = (e: any) => {
    setPending(true);
    try {
      e.preventDefault();
      fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then((data) => { setResponse(data.message); setPending(false); responseref.current?.classList.add('animateme'); emptyData() });
    } catch (error) {
      setResponse(`# Error Occured! \n Some error occured! \n ${error}`);
      setPending(false)
    }

  }

  const emptyData = () => {
    data.mode = 'generate',
    data.prompt = '...'
  }

  return (
    <section className='w-full h-screen relative bg-gray-900'>
      <div className='absolute top-0 left-28 bg-sky-400/50 blur-3xl z-0 w-60 h-[30rem] -rotate-45 rounded-full'></div>
      <div className='absolute top-28 flex flex-col justify-center items-center gap-2 w-full'>
        <h3 className='text-center text-yellow-400 font-bold text-5xl'>JavaScript <span className='text-transparent bg-gradient-to-tl from-purple-400 to-sky-400 bg-clip-text'>AI</span></h3>

        <div className='flex my-5 justify-center w-3/4 items-center gap-2'>
          <div id='userinputsection' className='bg-gray-800 w-1/2 p-5 my-2 rounded-md flex flex-col'>
            <div className='flex justify-start items-center gap-3'>
              <p className='text-white'>Select Mode:</p>
              <select name='mode' id='mode' className='bg-transparent px-3 py-2 outline-none border-2 border-gray-500 focus:border-yellow-400 text-white focus:text-yellow-500 rounded-md transition-colors duration-200' onChange={(e) => setData({ ...data, mode: e.target.value })} value={data.mode}>
                <option className='bg-gray-800 p-2 text-yellow-400' disabled value={''}>Select</option>
                <option className='bg-gray-800 p-2 text-yellow-400' value={'Generate'}>Generate</option>
                <option className='bg-gray-800 p-2 text-yellow-400' value={'Modify'}>Modify</option>
                <option className='bg-gray-800 p-2 text-yellow-400' value={'Explain'}>Explain</option>
              </select>
            </div>
            {data.mode && (
              <textarea className='w-full my-2 p-2 rounded-md outline-none border-2 border-gray-500 focus:border-yellow-500 text-white bg-transparent h-64 resize-none overflow-y-auto' placeholder={placeholder} name='prompt' onChange={(e) => { setData({ ...data, prompt: e.target.value }) }}>
              </textarea>
            )}
            {data.prompt && <button className='bg-yellow-500 text-gray-900 font-semibold border-2 border-transparent hover:bg-transparent hover:text-white hover:border-yellow-500 px-3 py-2 rounded-md transition-colors duration-200' onClick={(e) => generateContent(e)}>{pending ? data.mode + "ing..." : data.mode}</button>}
          </div>

          <div id='responsesection' ref={responseref} className='bg-gray-800 w-1/2 p-5 my-2 rounded-md flex flex-col overflow-y-auto'>
            {!response && (
              <div className='w-full h-full flex justify-center items-center'>
                <h3 className='text-center font-bold text-4xl text-gray-600'>{pending ? "AI Is Thinking..." : "AI Is Waiting!"}</h3>
              </div>
            )}
            {response && (
              <>
              <h2 className='py-2 text-xl text-white font-semibold'>Response from AI:</h2>
              <Markdown
                className={'markdown'}
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        {...props}
                      />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {response}
              </Markdown>
              </>

            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
