import { useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./views/layouts/AuthLayout";
import { useStateContext } from "./context/ContextProvider";
import DefaultLayout from "./views/layouts/DefaultLayout";
import Login from "./views/pages/Acc_Login_ForgotPass/Login";
import { AdminDashboard } from "./views/pages/Admin/Dashboard/AdminDashboard";
import NotFound from "./views/components/NotFound";
import Edit_Fac from "./views/pages/Admin/Faculty/Edit_Fac";
 
import View_Fac from "./views/pages/Admin/Faculty/View_Fac";
import Display_Fac from "./views/pages/Admin/Faculty/Display_Fac";
import Ooo from "./views/pages/Acc_Login_ForgotPass/Ooo";
import D from "./views/pages/Acc_Login_ForgotPass/D";
import S from "./views/pages/Acc_Login_ForgotPass/S";
import SocialShare from "./views/pages/Admin/Faculty/SocialShare";
import Display_Att from "./views/pages/Admin/Attendance/Display_Att";
import Display_Dept from "./views/pages/Admin/Department/Display_Dept";
import Add_Dept from "./views/pages/Admin/Department/Add_Dept";
import View_Dept from "./views/pages/Admin/Department/View_Dept";
import Create_Fac from "./views/pages/Admin/Faculty/Create_Fac"; 
import Display_Degree from "./views/pages/Admin/Degree/Display_Degree";
import FacultyImportForm from "./views/pages/Admin/Faculty/Import/FacultyImportForm";
import Display_Employment from "./views/pages/Admin/Employment/Display_Employment";
import Display_Sched from './views/pages/Admin/Schedule/Display_Sched'
import Sched_Info from "./views/pages/Admin/Faculty/Sched_Info/Sched_Info";
import PayrollDashboard from './views/pages/Payroll/PayrollDashboard'
import PayrollLayout from './views/layouts/PayrollLayout' 
import Full_Time_Payroll from "./views/pages/Payroll/Payroll_Info/Full_Time/Full_Time_Payroll";
import Part_Time_Payroll from './views/pages/Payroll/Payroll_Info/Part_Time/Part_Time_Payroll';
import Add_Att from "./views/pages/Admin/Attendance/Add_Att";
import Full_Time_ExtraLoad from "./views/pages/Payroll/Payroll_Info/Full_Time/Full_Time_ExtraLoad";
import Part_Time_Payroll_Attendance from "./views/pages/Payroll/Payroll_Info/Part_Time/Part_Time_Payroll_Attendance";
import Profile_Info from "./views/pages/Admin/Profile/Profile_Info";
import Full_Time_Attendance from "./views/pages/Payroll/Payroll_Info/Full_Time/Full_Time_Attendance";
import Extraload_Attendance from "./views/pages/Payroll/Payroll_Info/Full_Time/Extraload_Attendance";
import FacultyDashboard from "./views/pages/Admin/Dashboard/FacultyDashboard";
import Work_Load_PT from "./views/pages/Admin/WorkLoad/Work_Load_PT";
import Part_time_Calculations from "./views/pages/Admin/Calculations/Part_time_Calculations";
import Full_Time_Calculations from "./views/pages/Admin/Calculations/Full_Time_Calculations";
import PT_Regular_Calculations from "./views/pages/Admin/Calculations/PT_Regular_Calculations";
import Program_Heads_Calculations from "./views/pages/Admin/Calculations/Program_Heads_Calculations";
import Extra_Load_Computations from "./views/pages/Admin/Calculations/Extra_Load_Computations";
import Program_heads from "./views/pages/Payroll/Payroll_Info/Program_Heads/Program_heads";
import PT_Regular from "./views/pages/Payroll/Payroll_Info/PT_Reglar/PT_Regular";
import History from "./views/pages/Payroll/History_Info/History_Payroll/History";
import Gagu from "./views/pages/Payroll/History_Info/History_Payroll/Gagu";
import History_Part_Time from "./views/pages/Payroll/History_Info/History_Payroll/History_Part_Time";
import History_Program_Heads from "./views/pages/Payroll/History_Info/History_Payroll/History_Program_Heads";
import History_PT_Regular from "./views/pages/Payroll/History_Info/History_Payroll/History_PT_Regular";
import Full_Time_Adjustment from "./views/pages/Admin/Adjustment/Full_Time_Adjustment";
import Part_Time_Adjustment from "./views/pages/Admin/Adjustment/Part_Time_Adjustment";
import PT_Regular_Adjustment from "./views/pages/Admin/Adjustment/PT_Regular_Adjustment";
import Program_Heads_Adjustments from "./views/pages/Admin/Adjustment/Program_Heads_Adjustments";
import Full_Time_History from "./views/pages/Admin/History/Full_Time_History";
import Try from "./views/pages/Admin/History/Try";
import Part_Time_History from "./views/pages/Admin/History/Part_Time_History";
import PT_Regular_History from "./views/pages/Admin/History/PT_Regular_History";
import Program_Heads_History from "./views/pages/Admin/History/Program_Heads_History";
function App() {
  const { user, token } = useStateContext();

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="ooo" element={<S />} />
          <Route path="dash" element={<D />} /> 
        </Route>


        {token ? (
          <Route path='/' element={<DefaultLayout />}>
            {user.user_type === 'admin' && (
              <>
                <Route path='/admin/dashboard' element={<AdminDashboard />}/> 
                {/* <Route path='/admin/dashboard' element={<FacultyDashboard />}/>  */}
                <Route path='/admin/faculty' element={<Display_Fac />} /> 
                <Route path="/faculty" element={<Display_Fac />} />
                <Route path="/edit_faculty/:id" element={<Edit_Fac />} />
                <Route path="/view_faculty/:id" element={<View_Fac />} />
                <Route path="/create_faculty" element={<Create_Fac />} /> 
                <Route path="/sched_info/:id" element={<Sched_Info />} /> 

                <Route path="/attendance/record" element={<Display_Att />} />
                <Route path="/attendance/import" element={<Add_Att />} />


                <Route path="/department/list" element={<Display_Dept />} />
                <Route path="/departments/:departmentId" element={<View_Dept />} />
                <Route path="/department/add" element={<Add_Dept />} />
                <Route path="*" element={<NotFound />} />

                <Route path="/schedule/list" element={<Display_Sched />} /> 
                <Route path="/degree/list" element={<Display_Degree />} /> 
                <Route path="/social" element={<SocialShare />} />


                <Route path="/try/import" element={<FacultyImportForm />} /> 
                <Route path="/employment/list" element={<Display_Employment />} /> 
                <Route path="/admin/profile" element={<Profile_Info />} />


                {/* //workload */}
                <Route path="/workload/part_time" element={<Work_Load_PT />} />

                {/* calculations */}
                <Route path="/admin/part/time" element={<Part_time_Calculations />} />
                <Route path="/admin/full/time" element={<Full_Time_Calculations />} />
                <Route path="/admin/part/time/regular" element={<PT_Regular_Calculations />} />
                <Route path="/admin/program/heads" element={<Program_Heads_Calculations />} />
                <Route path="/admin/extra/load" element={<Extra_Load_Computations />} />

                {/* payroll infoooooooo */} 
                <Route path='/admin/adjustment/full/time' element={<Full_Time_Adjustment />} />
                <Route path='/admin/adjustment/part/time' element={<Part_Time_Adjustment />} />
                <Route path='/admin/adjustment/parttime/regular' element={<PT_Regular_Adjustment />} />
                <Route path='/admin/adjustment/program/heads' element={<Program_Heads_Adjustments />} />

                {/* history ni info */}
                <Route path='/admin/history/full/time' element={<Full_Time_History />} />
                <Route path='/admin/history/part/time' element={<Part_Time_History />} />
                <Route path='/admin/history/part/time/regular' element={<PT_Regular_History />} />
                <Route path='/admin/history/program/heads' element={<Program_Heads_History />} />


                {/* try rani oi */}
                <Route path='/admin/try' element={<Try />} />
              </>
            )}
            {user.user_type === 'payroll' && (
              <> 
                <Route path='/payroll/dashboard' element={<AdminDashboard />} /> 
                {/* <Route path='/payroll/history' element={<Gagu />} /> */}
                <Route path='/payroll/history/parttime/regular' element={<History_PT_Regular />} />
                <Route path='/payroll/history/program/heads' element={<History_Program_Heads />} />
                <Route path='/payroll/history/part/time' element={<History_Part_Time />} />
                <Route path='/payroll/history/full/time' element={<History />} />
                <Route path='/payroll/pt-regular' element={<PT_Regular />} />
                <Route path="/payroll/program-heads" element={<Program_heads />} />
                <Route path='/payroll/full_time' element={<Full_Time_Payroll />} />
                <Route path='/attendance-full-time-details/:facultyId' element={<Full_Time_Attendance />} />  
                <Route path='/payroll/part_time' element={<Part_Time_Payroll />} />
                <Route path='/attendance-part-time-details/:facultyId' element={<Part_Time_Payroll_Attendance />} /> 
                <Route path='/payroll/full_time/extraload' element={<Full_Time_ExtraLoad />} /> 
                <Route path='/attendance-full-time-extraload-details/:facultyId' element={<Extraload_Attendance />} /> 
                <Route path="/admin/profile" element={<Profile_Info />} />
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
