import React, { useEffect, useState, useRef, forwardRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../style/dropdown.css"
import "../style/upload.css"
import { basicURL } from '../App';

export default function Upload() {

  //courseName should be connected to SQL from backend and be dynamic
  //use fetchCourse(list) to modify courseName
  const [courseName, fetchCourse] = useState([]);

  //examList should also be connected to SQL from backend and be dynamic
  //use fetchExam(list) to modify examList
  const [examList, fetchExam] = useState([]);
  //semesterList should also be connected to SQL from backend and be dynamic
  //use fetchSemester(list) to modify semesterList
  const [semesterList, fetchSemester] = useState<string[]>([]);
  //currentSemester = the id of the semester selected
  //modifySemester = function to set currentSemester
  const [currentSemester, modifySemester] = useState(NaN);

  //currentCourse = the id of the course selected
  //modifyCourse = function to set currentCourse
  const [currentCourse, modifyCourse] = useState(NaN);
  const [courseInput, setCourseInput] = useState("請輸入課程名稱");

  //currentExam = the id of the exam selected
  //modifyExam = function to set currentExam
  const [currentExam, modifyExam] = useState(NaN);
  const [examInput, setExamInput] = useState("請輸入考試名稱");

  //this is the variable which store inputFile
  const inputFile = useRef<HTMLInputElement>(null);

  //NaN = haven't clicked upload btn
  //1 = uploading
  //2 = success to upload
  //3 = fail to upload
  const [uploadLimit, updateUploadLimit] = useState(100);
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData();
      fetchCourse(fetchedData.course);
      fetchExam(fetchedData.exam_type);
      const allow_current_year = 10;
      const current_year = new Date().getFullYear();
      const semester = [];
      for (let i = 1; i < allow_current_year; i++) {
        if (i === 1 && new Date().getMonth() > 8) {
          semester.push(`${current_year - 1911}-1`);
        }
        semester.push(`${current_year - i - 1911}-2`);
        semester.push(`${current_year - i - 1911}-1`);
      }
      semester.push('其他');
      fetchSemester(semester);

    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const fetchData: { limit_MB: number } = await fetch(basicURL + 'api/upload-file/upload-limit', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then(res => {
        if (res.status === 200) {
          return res.json()
        } else {
          console.error('Error:', res);
          return { limit_MB: 100 };
        }
      })
        .catch(err => {
          console.error(err);
          return { limit_MB: 100 };
        });
      updateUploadLimit(fetchData.limit_MB);
    };
    fetchData();
  }, []);
  async function getData() {
    return fetch(basicURL + 'api/filter/tags?tags=all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        console.error('Error:', res);
        return {
          semester: [],
          course: [],
          exam_type: []
        };
      }
    })
      .then(data => {
        return {
          semester: data.semester,
          course: data.subject,
          exam_type: data.exam_type
        }
      })
      .catch(err => {
        console.error(err);
        return {
          semester: [],
          course: [],
          exam_type: []
        };
      });
  }
  return (
    <div className="upload__container">
      <Dropdown
        buttonText={isNaN(currentSemester) ? " 選擇學期" : `${semesterList[currentSemester]}`}
        dropdown_list={semesterList} modify_dropdown_selection={modifySemester}
        others={false}
      />

      <Dropdown
        buttonText={isNaN(currentCourse) ? " 選擇科目" : (currentCourse === -1 ? `其他` : `${courseName[currentCourse]}`)}
        dropdown_list={courseName} modify_dropdown_selection={modifyCourse}
        others={true}
      />

      <Dropdown
        buttonText={isNaN(currentExam) ? " 選擇考試" : (currentExam === -1 ? `其他` : `${examList[currentExam]}`)}
        dropdown_list={examList} modify_dropdown_selection={modifyExam}
        others={true}
      />

      {currentCourse === -1 ? (
        <input type="text" placeholder={courseInput} onChange={e => setCourseInput(e.target.value)} />
      ) : (
        <></>
      )
      }

      {currentExam === -1 ? (
        <input type="text" placeholder={examInput} onChange={e => setExamInput(e.target.value)} />
      ) : (
        <></>
      )
      }

      <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} accept="application/pdf" />
      <button className="local-upload-btn" onClick={LocalUploadFile}>上傳檔案</button>

      <button
        className={`upload-btn ${isValidToUpload() ? 'enabled' : 'disabled'}`}
        disabled={!isValidToUpload()}
        onClick={uploadFile}
      >
        上傳
      </button>
      <div className="upload-limit">檔案大小限制：{uploadLimit} MB</div>
      <div className="upload-limit">檔案格式限制：PDF</div>
      <div className="upload-limit">請自行去識別化（如遮蔽姓名、學號等個資），系學會不負責進一步處理或校驗</div>

    </div>
  )

  function isValidToUpload() {
    return !isNaN(currentSemester) && !isNaN(currentCourse) && !isNaN(currentExam);
  }

  function LocalUploadFile() {
    if (inputFile.current === null) {
      return;
    }
    inputFile.current.click();
  }

  //this function is for uploading file to backend
  async function uploadFile() {

    //should connect to backend and upload file here
    const formUpload = new FormData();
    if (inputFile.current === null) {
      alert("請選擇檔案！");
      return;
    }
    if (inputFile.current.files === null || inputFile.current.files.length === 0) {
      alert("請選擇檔案！");
      return;
    }
    if (inputFile.current.files[0].size > uploadLimit * 1024 * 1024) {
      alert(`檔案大小不得超過 ${uploadLimit}MB`);
      return;
    }
    if (inputFile.current.files[0].type !== 'application/pdf') {
      alert("請上傳 PDF 檔案！");
      return;
    }
    formUpload.append("file", inputFile.current.files[0], inputFile.current.files[0].name);
    formUpload.append("semester", semesterList[currentSemester]);
    formUpload.append("subject", currentCourse === -1 ? courseInput : courseName[currentCourse]);
    formUpload.append("exam_type", currentExam === -1 ? examInput : examList[currentExam]);
    await fetch(basicURL + 'api/upload-file/upload', {
      method: 'POST',
      headers: {},
      credentials: 'include',
      body: formUpload
    }).then(res => {
      if (res.status === 200) {
        alert("上傳成功！")
        window.location.reload()
      } else {
        alert("上傳失敗，請重新嘗試或聯絡系學會管理員！")
      }
    });
  }

}



interface DropdownItemProps {
  onClick: () => void;
  children: React.ReactNode;
}

const DropdownItem = (props: DropdownItemProps) => {

  function onClickFunction(e: React.MouseEvent) {

    props.onClick();
  }


  return (
    <div className="dropdown-item" onClick={onClickFunction}>
      {props.children}
    </div>
  );
};

interface DropdownProps {
  buttonText: string;
  dropdown_list: string[];
  modify_dropdown_selection: (id: number) => void;
  others: boolean;
}

const Dropdown = ({ buttonText, dropdown_list, modify_dropdown_selection, others }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState<number | null>(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!open) {
      const spaceRemaining =
        buttonRef.current ? window.innerHeight - buttonRef.current.getBoundingClientRect().bottom : 0;
      const contentHeight = contentRef.current ? contentRef.current.clientHeight : 0;

      const topPosition =
        spaceRemaining > contentHeight
          ? null
          : -(contentHeight - spaceRemaining); // move up by height clipped by window
      setDropdownTop(topPosition);
    }

    setOpen((open) => !open);
  };


  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current) {
        if (!dropdownRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef} className="dropdown">
      <DropdownButton ref={buttonRef} toggle={toggleDropdown} open={open}>
        {buttonText}
      </DropdownButton>
      {
        <DropdownContent top={dropdownTop} ref={contentRef} open={open}>
          <>
            {dropdown_list.map((item, id) => (
              <DropdownItem key={id} onClick={() => {
                modify_dropdown_selection(id);
                toggleDropdown()
              }}>{`${dropdown_list[id]}`}</DropdownItem>
            ))}
            {others ? <DropdownItem onClick={() => {
              modify_dropdown_selection(-1);
              toggleDropdown()
            }
            } >其他</DropdownItem> : <></>

            }
          </>
        </DropdownContent>
      }
    </div>
  );
};

interface DropdownButtonProps {
  children: React.ReactNode;
  toggle: () => void;
  open: boolean;
}

const DropdownButton = forwardRef<HTMLDivElement, DropdownButtonProps>((props, ref) => {
  const { children, toggle, open } = props;

  return (
    <div
      onClick={toggle}
      className={`dropdown-btn ${open ? "button-open" : null}`}
      ref={ref}
    >
      {children}
      <span className="toggle-icon">
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </span>
    </div>
  );
});

interface DropdownContentProps {
  children: React.ReactNode;
  open: boolean;
  top: number | null;
}

const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>((props, ref) => {
  const { children, open, top } = props;
  return (
    <div
      className={`dropdown-content ${open ? "content-open" : null}`}
      style={{ top: top ? `${top}px` : "100%" }}
      ref={ref}
    >
      {children}
    </div>
  );
});