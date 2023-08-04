"use client"

import { useState, useEffect } from "react"
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineCopy } from 'react-icons/ai';
import { useTypingEffect } from '../hook/type-writing';

interface ArticlesProps{
  url: string,
  summary: string
}[]

const Content = () => {
  const [article, setArticle] = useState({
    url: '',
    summary: ''
  });

  const [allArticles, setAllArticles] = useState<ArticlesProps[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [copy, setCopy] = useState<string | boolean>("")

  const text = useTypingEffect(`${article.summary}`, 10)

  // LOCAL STORAGE
  useEffect(() => {
    const articlesFromLocalStorage = localStorage.getItem('articles');

    if (articlesFromLocalStorage !== null){
      const parsedArticles = JSON.parse(articlesFromLocalStorage);
      setAllArticles(parsedArticles);
    }
  }, [])

  // data fetching
  const fetchSummary = async (e: React.FormEvent<HTMLFormElement> | undefined) => {

    if(e) {
      e.preventDefault();
    }

    setLoading(true);

    const headers = {
      'X-RapidAPI-Key': process.env.API_KEY as string,
      'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com',
    };

    const response = await fetch(
      `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${article.url}&length=3`, {
      headers: headers,
    });

    const data: any = await response.json();
    console.log(data)
    
    try{

      if(data?.summary){
        const newArticle = { ...article, summary: data.summary }

        const updatedArticles = [newArticle, ...allArticles];
        setAllArticles(updatedArticles);

        setArticle({
          url: '',
          summary: newArticle.summary
        });

        localStorage.setItem('articles', JSON.stringify(updatedArticles))
      }

    }catch(err){
      setError(true)
    }finally{
      setLoading(false)
    }

  }

  useEffect(() =>{
    if(!article){
      fetchSummary(undefined)
    }
  }, [])

  const handleCopy = (copiedSummary: string) => {
    setCopy(copiedSummary);

    navigator.clipboard.writeText(copiedSummary);

    setTimeout(() => setCopy(false), 3000)
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <form 
        onSubmit={fetchSummary}
        className="w-full md:w-[80%] lg:w-[50%] relative h-[35px] z-0"
      >
        <input 
          type="text" 
          className="input"
          value={article.url}
          onChange={(e) => setArticle({ ...article, url: e.target.value })}
          placeholder="Input article's link here"
        />
        <button type="submit" className="bg-[#0081b4] dark:bg-[#62cdff]
        text-white absolute right-0 w-[10%] lg:w-[5%] h-[100%]">
          +
        </button>
      </form>

      {/* History */}
      {allArticles.slice(0,4)?.map((article, index) => (
        <>
          <div onClick={() => setArticle(article)} key={`link-${index}`} 
          className="summary-box p-2 w-full md:w-[80%] lg:w-[50%] my-1 text-sm text-[#0081b4] 
          dark:tex-[#62cdff]">
            <p className="cursor-pointer truncate">{article.url}</p>
          </div>
        </>
      ))}

      {/* summary */}
      <div className="my-8 flex justify-center items-center">
        {loading ? <p>Loading Please wait, it may take 15seconds...</p> 
        : error ? <p>Something went wrong...</p>
        :(
          article?.summary && (
            <div className="summary-box bg-white dark:bg-slate-700 p-4 w-full lg:w-[80vw] md:w-[90vw] sm:w-full">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-base md:text-2xl">
                  <span className="font-bold">
                    Article
                  </span>
                  <span className="font-extralight">
                    Summary
                  </span>
                </h1>
                
                <span className="font-bold text-xl cursor-pointer" onClick={() => handleCopy(article.summary)}>
                  {copy ? <p className="copy"><BsCheckLg /> <span className="text-sm">Copied</span></p>
                        : <p className="copy"><AiOutlineCopy /> <span className="text-sm">Copy</span></p>
                  }
                </span>

              </div>
              <p className="text-base">{text}</p>
            </div>
          )
        )}
      </div>

    </div>
  )
}

export default Content