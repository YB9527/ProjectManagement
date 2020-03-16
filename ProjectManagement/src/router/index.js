import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index/Frontpage'
import Content from '@/components/index/Content'
import Left from '@/components/index/Left'
import AllProject from '@/components/views/AllProject'
import Top from '@/components/index/Top'
import App from "../App";
import UploadPageStep from '@/components/Upload/Step'
import HandListPage from '@/components/views/HandListPage'
import ProjectShowPage from '@/components/views/ProjectShowPage'
import ProjectEdit from '@/components/Upload/ProjectEdit'
import SearchProject from '@/components/views/SearchProject'
import DownloadPage from '@/components/Upload/DownloadPage'
import Welcome from '@/components/index/Welcome'
import RecycleBin from "../components/views/RecycleBin";
import Exit from "../components/views/Exit";
import ProjectWaitPass from '@/components/Project/ProjectWaitPass';
import ProjectShare from '@/components/Project/ProjectShare';
import CheckProject from '@/components/Admin/CheckProject';

import login from "@/components/login/login";
import index from "@/components/index/index";
import register from "@/components/login/register";
import adminhome from "@/admin/Home";
import adminmain from "@/admin/main";
import adminindex from "@/admin/index/index"
import adddepartment from "@/admin/nav1/AddDepartment";
import deletedepartment from "@/admin/nav1/DeleteDepartment";
import addprojecttype from "@/admin/nav1/AddProjectType";
import deleteprojecttype from "@/admin/nav1/DeleteProjectType";
import adduser from "@/admin/nav3/AddUser";
import deleteuser from "@/admin/nav3/DeleteUser";


Vue.use(Router);

export default new Router({
  linkActiveClass: 'el-menu-item is-active1',

  routes: [
    {

      path: '/Exit',
      name: 'Exit',
      component: Exit,
    },
    {
      path: '/Welcome',
      redirect: '/home/Content/Welcome'
    },
    {
      path: '/home',
      name: 'home',
      components: {
        default: Content,
        'Top': Top,
        'Left': Left
      },
      children: [
        {
          path: 'Content',
          name: 'Content',
          component: Content,
          children: [
            {
              path: 'AllProject',
              name: 'AllProject',
              component: AllProject
            }, {
              path: 'HandListPage',
              name: 'HandListPage',
              component: HandListPage
            },
            {
              path: 'UploadPageStep',
              name: 'UploadPageStep',
              component: UploadPageStep

            }, {

              path: 'ProjectShowPage',
              name: 'ProjectShowPage',
              component: ProjectShowPage
            }, {
              path: 'ProjectEdit',
              name: 'ProjectEdit',
              component: ProjectEdit
            }, {
              path: 'SearchProject',
              name: 'SearchProject',
              component: SearchProject
            }, {
              path: 'DownloadPage',
              name: 'DownloadPage',
              component: DownloadPage

            }, {

              path: 'Welcome',
              name: 'Welcome',
              component: Welcome


            },
            {
              path: 'RecycleBin',
              name: 'RecycleBin',
              component: RecycleBin
            },
            {
              path: 'ProjectWaitPass',
              name: 'ProjectWaitPass',
              component: ProjectWaitPass
            },{
              path: 'ProjectShare',
              name: 'ProjectShare',
              component: ProjectShare
            }
            ,{
              path: 'CheckProject',
              name: 'CheckProject',
              component: CheckProject
            }

            //另一个


          ]
        }
      ]
    },
    {
      path: "/",
      //redirect: '/home/Content/AllProject'
      name: "login",
      component: login
    },
    {
      path: "/index",
      name: "index",
      component: index
    },
    {
      path: "/register",
      name: "register",
      component: register
    },

    //管理员路由
    {
      path: "/admin/adminhome",
      name: "adminhome",
      component: adminhome,
      children: [
        {
          path: "adminmain",
          name: "adminmain",
          component: adminmain,
          children: [
            {
              path: "adminindex",
              name: "adminindex",
              component: adminindex
            },
            {
              path: "adddepartment",
              name: "adddepartment",
              component: adddepartment
            },
            {
              path: "deletedepartment",
              name: "deletedepartment",
              component: deletedepartment
            },
            {
              path: "addprojecttype",
              name: "addprojecttype",
              component: addprojecttype
            },
            {
              path: "deleteprojecttype",
              name: "deleteprojecttype",
              component: deleteprojecttype
            },
            {
              path: "adduser",
              name: "adduser",
              component: adduser
            },
            {
              path: "deleteuser",
              name: "deleteuser",
              component: deleteuser
            }
          ]
        }
      ]
    }


  ]
})
