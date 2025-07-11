import React from 'react'
import '../style/docs.css'
export default function TermsOfUse() {
    return (
        <div className="legal-page-container">
            <div className='TermsOfUse-Box'>
                <h1>隱私權政策</h1>
                <p><strong>最後更新日期：</strong>114 年 6 月 26 日<br />
                    <strong>生效日期：</strong>同上</p>

                <h2>一、前言</h2>
                <p>
                    感謝您使用本「考古題系統」（以下簡稱「本系統」）。
                    本系統由國立臺灣師範大學資訊工程學系學會（以下簡稱「系學會」）負責營運與管理，
                    並依據《<a href='https://drive.google.com/file/d/1W4NVe9Egw3HSWqflPO4Nhub0yW6FXrFy/view?usp=sharing' target="_blank" rel="noreferrer">國立臺灣師範大學資訊工程學系學會考古題管理辦法</a>》（以下簡稱「考古題辦法」）進行資料處理與權限控管。<br />
                    系學會十分重視使用者的個人資料與使用紀錄，並致力於遵守《個人資料保護法》及相關法規，確保您在使用本系統過程中所提供的資訊受到妥善保護。<br />
                    當您使用或繼續使用本系統，即表示您已閱讀、瞭解並同意本隱私權政策的所有內容。<br />
                    若您不同意本政策之部分或全部，請停止使用本系統。如有任何疑問，歡迎聯繫系學會以獲得進一步說明。
                </p>
                <h2>二、我們收集的資訊</h2>
                <ul>
                    <li><strong>登入紀錄：</strong>包含登入時間、IP 位址、帳號識別碼等基本日誌資訊，僅用於維護系統穩定與安全。</li>
                    <li><strong>上傳資訊：</strong>若您上傳考古題檔案，我們會儲存您的使用者識別碼、上傳時間與檔案資訊（含檔名、標籤分類），以供後續管理。</li>
                    <li><strong>使用行為：</strong>系統可能記錄您查詢、瀏覽與下載的操作紀錄，用於系統優化與使用統計，並不會對個別操作行為進行個人識別分析。</li>
                    <li><strong>驗證資訊與憑證：</strong>當使用者成功登入後，系統會在瀏覽器中以 Cookie 形式儲存身份驗證憑證，用以維持登入狀態與存取權限。該憑證僅用於辨識使用者身分，不包含明文密碼，並會依伺服器端設定自動失效。</li>
                </ul>

                <h2>三、資訊使用目的</h2>
                <ul>
                    <li>維護與優化系統功能。</li>
                    <li>確認帳號使用狀態並管理權限。</li>
                    <li>依照《考古題辦法》管理立書人授權之檔案與授權資料。</li>
                    <li>處理違規行為，包含超出授權範圍的重製、傳播或共享行為。</li>
                </ul>

                <h2>四、檔案授權與處理</h2>
                <ul>
                    <li>立書人一經上傳，即視為同意授權系學會使用其檔案，範圍包括重製、改作、編輯、公開傳輸、散佈等，詳見《考古題辦法》第三章。</li>
                    <li>所有檔案須由立書人自行進行去識別化，系學會不負責移除文件中個人資訊。</li>
                    <li>系學會將於檔案中加入浮水印（僅限於答案部分）以保障授權紀錄，不另做身份標示。</li>
                </ul>

                <h2>五、資訊分享與揭露</h2>
                <p>系學會不會將您的個人資料提供予任何第三方，除非符合以下條件之一：</p>
                <ul>
                    <li>為處理系統安全或權限異常行為之必要調查。</li>
                    <li>應中華民國法律規定或主管機關要求。</li>
                    <li>經您本人明確書面同意。</li>
                </ul>

                <h2>六、資料儲存與安全</h2>
                <ul>
                    <li>所有資料儲存於系學會所屬安全伺服器或受信任服務平台，僅限系學會相關權限成員存取。</li>
                    <li>系學會將定期檢查系統安全性，避免未經授權之存取、外洩、篡改或遺失。</li>
                    <li>若您發現有疑似帳號遭盜用、檔案誤上傳等狀況，請立即通知系學會處理。</li>
                </ul>

                <h2>七、資料保留期間</h2>
                <ul>
                    <li>上傳之考古題將永久儲存於系統資料庫，除非立書人提出正當申請並獲學會審查通過。</li>
                    <li>違規紀錄依《考古題辦法》保存至少 24 週，最長 48 週。</li>
                </ul>

                <h2>八、您的權利</h2>
                <p>根據《個人資料保護法》，您對您的個資享有下列權利：</p>
                <ol>
                    <li>查詢或請求閱覽。</li>
                    <li>請求補充或更正。</li>
                    <li>請求停止蒐集、處理或利用。</li>
                    <li>請求刪除。</li>
                </ol>
                <p>您可透過系學會聯繫窗口提出請求，系學會得視系統運作需求及使用記錄合理性審查是否可執行該請求。</p>

                <h2>九、政策變更與解釋權</h2>
                <ol>
                    <li>系學會得視實際情況修訂本政策，若有變更將同步更新本政策之「最後更新日期」，請您定期查閱。</li>
                    <li>使用者如於政策變更後仍繼續使用本系統，即視為同意接受修訂後內容。</li>
                    <li>本政策之最終解釋權，歸屬於系學會。</li>
                </ol>

                <h2>十、聯絡資訊</h2>
                <p>若您對本條款有任何疑問，請聯絡資訊工程學系學會以取得協助。</p>
                <ul>
                    <li>Email: <a href="mailto:ntnucsie.union@gmail.com">ntnucsie.union@gmail.com</a></li>
                    <li>Instagram: <a href="https://www.instagram.com/ntnu_csie">@ntnu_csie</a></li>
                </ul>
            </div>
            
            {/* 回首頁按鈕 */}
            <div className="back-to-home">
                <button 
                    onClick={() => window.location.href = '/'}
                    className="back-to-home-btn"
                >
                    回首頁
                </button>
            </div>
        </div>
    )
}