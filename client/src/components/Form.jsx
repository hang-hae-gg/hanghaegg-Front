import React, { useEffect, useState } from "react";
import { getAPI, postAPI } from "../axios";
import { useNavigate } from "react-router-dom";

function Form() {
  const [showForm, setShowForm] = useState(false);
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [data, setData] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    getAPI(
      `/matches`
    )
      .then((data) => {
        setData(data.data);
        console.log("data :: ", data.data);
      })
      .catch((e) => {
        console.log("e :: ", e);
      });
  }, []);


  console.log(data);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleInputChange1 = (event) => {
    setInputValue1(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setInputValue2(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      title: inputValue1,
      content: inputValue2,
    }
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], {
      type: 'application/json'
    }));
    if (selectedFile) {
      formData.append('img', selectedFile);
    }

    postAPI('/matches', formData)
        .then(response => {
            console.log(response);  
            return getAPI('/matches');
        })
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error(error); 
        });

    setInputValue1('');
    setInputValue2('');
    setSelectedFile(null);
};

const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};

const handleDetailPage = (postId) => {
  navigate(`/community/${postId}`)
}

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <button className="text-sm font-bold bg-black text-white w-20 h-10 flex justify-center items-center rounded-md border border-gray-300 font-sans">
          업데이트
        </button>
        <button
          className={`text-sm font-bold w-20 h-10 rounded-md border border-gray-300 font-sans 
          ${showForm ? 'bg-white text-black' : 'bg-blue-500 text-white'}
          `}
          onClick={handleToggleForm}
        >
          {showForm ? '닫기' : '글쓰기'}
        </button>
      </div>

      {showForm && (
        <div className="flex justify-start">
          <form onSubmit={handleFormSubmit}>
            <input
              className="border border-gray-300 px-4 py-2 rounded"
              type="text"
              value={inputValue1}
              onChange={handleInputChange1}
              placeholder="소환사명"
            />
            <input
              className="border border-gray-300 px-4 py-2 rounded"
              type="text"
              value={inputValue2}
              onChange={handleInputChange2}
              placeholder="내용(200자 이내)"
            />
            <input type="file" onChange={handleFileChange} />
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" type="submit">
              등록
            </button>
          </form>
        </div>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-4">
          {data && data.map((post, i) => (
            <div key={i} className="border border-gray-300 p-4 rounded w-80 h-56">
              <div>
                <div>소환사명:{post.title}</div>
                <div>내용:{post.content}</div>
                <div>사진:
                <img src={post.img} alt="post" />
                 </div>
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div><button 
                    onClick={() => handleDetailPage(post.boardId)}
                    className="text-sm font-bold bg-blue-500 text-white w-20 h-10 flex justify-center items-center rounded-md border border-gray-300 font-sans">
                      상세보기</button></div>
                    <div><button className="text-sm font-bold bg-red-500 text-white w-20 h-10 flex justify-center items-center rounded-md border border-gray-300 font-sans">게시글 삭제</button></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Form;
