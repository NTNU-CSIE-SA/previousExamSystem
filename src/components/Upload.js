import { useEffect, useState, useRef, forwardRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../style/dropdown.css"
import "../style/upload.css"

export default function Upload(){

    //courseName should be connected to SQL from backend and be dynamic
    //use fetchCourse(list) to modify courseName
    const [courseName, fetchCourse] = useState(["演算法", "資料結構", "計算機結構", "計算機網路", "計算機圖學", "程式設計(一)"]);
    
    //examList should also be connected to SQL from backend and be dynamic
    //use fetchExam(list) to modify examList
    const [examList, fetchExam] = useState(["第一次考試", "第二次考試", "第三次考試", "期中考", "期末考"]);

    //semesterList should also be connected to SQL from backend and be dynamic
    //use fetchSemester(list) to modify semesterList
    const [semesterList, fetchSemester] = useState(["97-1", "97-2", "98-1", "98-2", "99-1", "99-2", "100-1", "100-2",
    "107-1", "107-2", "108-1", "108-2", "109-1", "109-2", "110-1", "110-2"]);

    //currentSemester = the id of the semester selected
    //modifySemester = function to set currentSemester
    const [currentSemester, modifySemester] = useState(NaN);

    //currentCourse = the id of the course selected
    //modifyCourse = function to set currentCourse
    const [currentCourse, modifyCourse] = useState(NaN);
    const [courseInput , setCourseInput] = useState("請輸入課程名稱");

    //currentExam = the id of the exam selected
    //modifyExam = function to set currentExam
    const [currentExam, modifyExam] = useState(NaN);
    const [examInput , setExamInput] = useState("請輸入考試名稱");

    //NaN = haven't clicked upload btn
    //1 = uploading
    //2 = success to upload
    //3 = fail to upload
    const [uploadStatus, updateUploadStatus] = useState("NaN");

    return(
        <>
        <div className="upload__container">

            <Dropdown
            buttonText={ isNaN(currentSemester) ?" 選擇學期" :  `${semesterList[currentSemester]}`}
            dropdown_list = {semesterList} modify_dropdown_selection = {modifySemester} 
            others = {false}
            />

            <Dropdown
            buttonText={ isNaN(currentCourse) ?" 選擇科目" : (currentCourse === -1 ? `其他` : `${courseName[currentCourse]}`)}
            dropdown_list = {courseName} modify_dropdown_selection = {modifyCourse} 
            others = {true}
            />
            
            <Dropdown
            buttonText={ isNaN(currentExam) ?" 選擇考試" : (currentExam === -1 ? `其他` : `${examList[currentExam]}`)}
            dropdown_list = {examList} modify_dropdown_selection = {modifyExam} 
            others = {true}
            />

            {currentCourse === -1 ? (
                <input type="text" placeholder={courseInput} onChange={e => setCourseInput(e.target.value)} />
                ):(
                <></>
                )
            }

            {currentExam === -1 ? (
                <input type="text" placeholder={examInput} onChange={e => setExamInput(e.target.value)} />
                ):(
                <></>
                )
            }

            <button
            className={`upload-btn ${isValidToUpload() ? 'enabled' : 'disabled'}`}
            disabled={!isValidToUpload()}
            onClick={uploadFile}
            >
              上傳
            </button>

            {isNaN(uploadStatus) ? 
              <></> :
              (
                uploadStatus === 1 ?
                <div className="upload_status_label" style={{backgroundColor: '#ddb070'}}>上傳中...</div> :
                (
                  uploadStatus === 2 ?
                  <div className="upload_status_label" style={{backgroundColor: '#3b7b2d'}}>上傳成功</div> :
                  <div className="upload_status_label" style={{backgroundColor: '#7b2d2d'}}>上傳失敗</div>
                )
              )
            }

        </div>
        </>
    )

    function isValidToUpload() {
      return !isNaN(currentSemester) && !isNaN(currentCourse) && !isNaN(currentExam);
    }

    //this function is for uploading file to backend
    async function uploadFile() {
      updateUploadStatus(1);
      
      //should connect to backend and upload file here

      //after upload, should updateUploadStatus according to success or failed

    }

}



const DropdownItem = (props) => {

    function onClickFunction(e){
        
        props.onClick();
    }


    return (
      <div className="dropdown-item" onClick={onClickFunction}>
            {props.children}
      </div>
    );
  };

const Dropdown = ({ buttonText, content, dropdown_list , modify_dropdown_selection , others }) => {
    const [open, setOpen] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);
  
    const dropdownRef = useRef();
    const buttonRef = useRef();
    const contentRef = useRef();
  
    const toggleDropdown = () => {
      if (!open) {
        const spaceRemaining =
          window.innerHeight - buttonRef.current.getBoundingClientRect().bottom;
        const contentHeight = contentRef.current.clientHeight;
  
        const topPosition =
          spaceRemaining > contentHeight
            ? null
            : -(contentHeight - spaceRemaining); // move up by height clipped by window
        setDropdownTop(topPosition);
      }
  
      setOpen((open) => !open);
    };

  
    useEffect(() => {
      const handler = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          
          setOpen(false);
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

const DropdownButton = forwardRef((props, ref) => {
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

const DropdownContent = forwardRef((props, ref) => {
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