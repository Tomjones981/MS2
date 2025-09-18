import { useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./views/layouts/AuthLayout";
import { useStateContext } from "./context/ContextProvider";
import DefaultLayout from "./views/layouts/DefaultLayout";
import Login from "./views/pages/Acc_Login_ForgotPass/Login";
import AdminDashboard from "./views/pages/Admin/Dashboard/AdminDashboard";
import NotFound from "./views/components/NotFound";  
import PayrollDashboard from './views/pages/Payroll/PayrollDashboard'  
import History_PT_Regular from "./views/pages/Payroll/History_Info/History_Payroll/History_PT_Regular";   
import Forgot_Password from "./views/pages/Acc_Login_ForgotPass/Forgot_Password";
import GuestLayout from "./views/layouts/GuestLayout";
import Record_List from "./views/pages/Admin/Records/Record_List";
import Pwd_List from "./views/pages/Admin/PWD/Pwd_List";
import Yearly_List from "./views/pages/Admin/PWD/Yearly_List";
import Brgy_Sectors from "./views/pages/Admin/PWD/Brgy_Sectors";
import Sub_Category from "./views/pages/Admin/PWD/Sub_Category";
import Personal_Info_List from "./views/pages/Admin/PWD/Personal_Info_List";
import Profile_Info from  './views/pages/Admin/Profile/Profile_Info'
import PWD_Total_List from "./views/pages/Admin/Dashboard/CHILDREN/PWD/PWD_Total_List";
import Year_CDC from "./views/pages/Admin/YEAR/CDC/Year_CDC"; 
import OPOL_CDCC from './views/pages/Admin/PWD/OPOL_CDCC'
import Opol_Cdc from './views/pages/Admin/PWD/Opol_Cdc' 
import Enrollees_CDC from './views/pages/Admin/PWD/Enrollees_CDC'
import Opol_ECCD from "./views/pages/Admin/PWD/Opol_ECCD";
import Hospital_Bill_Info from "./views/pages/Admin/Records/Hospital_Bill_Info";
import CICL_Info from "./views/pages/Admin/YEAR/SECTOR/SECTOR_CATEGORY/CHILDREN_CASES/CICL_Info";
import CICL_Graph from "./views/pages/Admin/Reports/CHILDREN_CASE/CICL/CICL_Graph";
import Index from "./views/pages/Admin/Reports/CHILDREN_CASE/Index"; 
import All from "./views/pages/Admin/YEAR/SECTOR/SECTOR_CATEGORY/CHILDREN_CASES/All";
import MergedGraph from './views/pages/Admin/Reports/CHILDREN_CASE/CICL/MergedGraph'
import CAR_Info from "./views/pages/Admin/YEAR/SECTOR/SECTOR_CATEGORY/CHILDREN_CASES/CAR_Info";
import RC_Info from "./views/pages/Admin/YEAR/SECTOR/SECTOR_CATEGORY/CHILDREN_CASES/RC_Info";
import AC_Info from "./views/pages/Admin/YEAR/SECTOR/SECTOR_CATEGORY/CHILDREN_CASES/AC_Info";
import Case_Graph from "./views/pages/Admin/Reports/CHILDREN_CASE/CICL/Case_Graph";
import Notes_Info from "./views/pages/Admin/Notes/Notes_Info";
function App() {
  const { user, token } = useStateContext();

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot_password" element={<Forgot_Password />} /> 
        </Route>

        
        <Route path="/guest" element={<GuestLayout />}>
          {/* <Route index element={<Navigate to="/login" />} /> */}
          {/* <Route path="login" element={<Login />} />  */}
        </Route>


        {token ? (
          <Route path='/' element={<DefaultLayout />}>
            {user.user_type === 'admin' && (
              <> 
                <Route path='/admin/profile' element={<Profile_Info />}/>   
                <Route path='/admin/notes' element={<Notes_Info />}/>   
                <Route path='/admin/dashboard' element={<AdminDashboard />}/>    
                <Route path='/admin/records' element={<Record_List />}/>       
                <Route path='/admin/cicl/report' element={<MergedGraph />}/>       
                <Route path='/admin/cicl/casegraph' element={<Case_Graph />}/>       
                <Route path='/admin/hospital_bill_info' element={<Hospital_Bill_Info />}/>  
                <Route path='/admin/yearlist' element={<Year_CDC />}/>     
                <Route path='/admin/report/pwd' element={<PWD_Total_List />}/>     
                <Route path='/admin/pwd-list' element={<Yearly_List />}/>    
                <Route path='/brgy-sectors/:yearId' element={<Brgy_Sectors />}/>   
                <Route path='/brgy-sectors/sub-category/:sectorId' element={<Sub_Category />}/>   
                <Route path='/brgy-sectors/sub-category/personal-info/:SubCatId' element={<Personal_Info_List />}/>   
                <Route path='/brgy-sectors/sub-category/opol-cdc/:SubCatId' element={<Enrollees_CDC />}/>    
                <Route path='/brgy-sectors/sub-category/opol-eccd/:SubCatId' element={<Opol_ECCD />}/> 
                {/* <Route path='/brgy-sectors/sub-category/cicl/:SubCatId' element={<CICL_Info />}/>     */}
                <Route path='/brgy-sectors/sub-category/all/:SubCatId' element={<All />}/>    
                <Route path='/brgy-sectors/sub-category/cicl/:SubCatId' element={<CICL_Info />}/>   
                <Route path='/brgy-sectors/sub-category/car/:SubCatId' element={<CAR_Info />}/>  
                <Route path='/brgy-sectors/sub-category/rc/:SubCatId' element={<RC_Info />}/>  
                <Route path='/brgy-sectors/sub-category/ac/:SubCatId' element={<AC_Info />}/>  



                {/* <Route path='/brgy-sectors/sub-category/cicl/:SubCatId' element={<Opol_Cdc />}/>    */}
                
              </>
            )}
            {user.user_type === 'payroll' && (
              <> 
                <Route path='/payroll/dashboard' element={<AdminDashboard />} />  
                <Route path='/payroll/history/parttime/regular' element={<History_PT_Regular />} /> 
              </>
            )}
            {user.user_type === 'faculty' &&  (
              <Route path='/faculty/dashboard' element={<PayrollDashboard />} />
            )}
            <Route path='*' element={<NotFound />} />
          </Route>
        ) : (
          <Route path='*' element={<Navigate to='/login' />} />
        )} 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
