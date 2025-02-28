 
import { ArrowsRightLeftIcon, ChevronDoubleRightIcon, ChevronDownIcon, ChevronRightIcon, DocumentTextIcon, FolderIcon, HomeIcon, MagnifyingGlassIcon, PowerIcon, PresentationChartLineIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline"
import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/solid"
import { Accordion, AccordionBody, AccordionHeader, Avatar, Badge, Breadcrumbs, Button, Card, IconButton, Input, List, ListItem, ListItemPrefix, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"
import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import Logo from '../../assets/images/OCC_LOGO.png'
import { useAuthContext } from "../../contexts/AuthContext"
import LoadingScreen from "../components/LoadingScreen"
import User from '../../assets/images/user.png'

const MSWDLayout = () => {
  const [open, setOpen] = useState(0)
  const [isOpen, setIsOpen] = useState(0)
  const route = useLocation()
  const { user, logout, loading } = useAuthContext()

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }

  const handleIsOpen = (value) => {
    setIsOpen(isOpen === value ? 0 : value)
  }

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <Card className="fixed h-[calc(100vh-2rem)] w-full max-w-[280px] inset-y-4 left-4 p-2 overflow-y-scroll" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex items-center gap-1 p-4">
              <img src={Logo} className="h-10 w-10" />
              <span className="font-bold text-xl">
                OCC
              </span>
            </div>
            <List>
              <span className="font-medium text-sm py-2">
                {user.role === 'admin' && 'Admin' || user.role === 'cashier' && 'Cashier'}
              </span>
              <Accordion
                open={open === 1}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0">
                  <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <img src={User} className="h-8 w-8" />
                    </ListItemPrefix>
                    {user.staff && (
                      <>
                        {user.staff.map((staff, index) => (
                          <span key={index} className="mr-auto text-sm font-normal">
                            {staff.information.first_name} {staff.information.last_name}
                          </span>
                        ))}
                      </>
                    )}
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      <span className="mr-auto text-sm font-normal">
                        My Profile
                      </span>
                    </ListItem>
                    <ListItem onClick={() => logout()}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      <span className="mr-auto text-sm font-normal">
                        Logout
                      </span>
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
            </List>
            <hr className="m-2 border-blue-gray-50" />
            {user.role === 'admin' && (
              <List>
                <span className="font-medium text-sm py-2">Main</span>
                <Accordion
                  open={open === 2}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                    />
                  }
                >
                  <Link to='/registrar/dashboard'>
                    <ListItem selected={route.pathname === '/registrar/dashboard' ? true : false} className="p-0">
                      <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                        <ListItemPrefix>
                          <PresentationChartLineIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <span className="mr-auto text-sm font-normal">
                          Dashboard
                        </span>
                      </AccordionHeader>
                    </ListItem>
                  </Link>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <ListItem>
                        <ListItemPrefix>
                          <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        <span className="mr-auto text-sm font-normal">
                          Reports
                        </span>
                      </ListItem>
                    </List>
                  </AccordionBody>
                </Accordion>
                <span className="font-medium text-sm py-2">Users</span>
                <Accordion
                  open={open === 3}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""}`}
                    />
                  }
                >
                  <Link to='/registrar/students'>
                    <ListItem selected={route.pathname === '/registrar/students' ? true : false} className="p-0">
                      <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
                        <ListItemPrefix>
                          <UsersIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <span className="mr-auto text-sm font-normal">
                          Students
                        </span>
                      </AccordionHeader>
                    </ListItem>
                  </Link>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <Link to='/registrar/students/applicants'>
                        <ListItem selected={route.pathname === '/registrar/students/applicants' ? true : false}>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          <span className="mr-auto text-sm font-normal">
                            Applicants
                          </span>
                        </ListItem>
                      </Link>
                      <Link to='/registrar/students/enrollees'>
                        <ListItem selected={route.pathname === '/registrar/students/enrollees' ? true : false}>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          <span className="mr-auto text-sm font-normal">
                            Enrollees
                          </span>
                        </ListItem>
                      </Link>
                    </List>
                  </AccordionBody>
                </Accordion>
                <Link to='/registrar/staffs'>
                  <ListItem selected={route.pathname === '/registrar/staffs' ? true : false}>
                    <ListItemPrefix>
                      <UsersIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <span className="mr-auto text-sm font-normal">
                      Staffs
                    </span>
                  </ListItem>
                </Link>
                <span className="font-medium text-sm py-2">Files</span>
                <Accordion
                  open={open === 4}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${open === 4 ? "rotate-180" : ""}`}
                    />
                  }
                >
                  <Link to='/registrar/documents'>
                    <ListItem selected={route.pathname === '/registrar/documents' ? true : false} className="p-0">
                      <AccordionHeader onClick={() => handleOpen(4)} className="border-b-0 p-3">
                        <ListItemPrefix>
                          <FolderIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <span className="mr-auto text-sm font-normal">
                          Documents
                        </span>
                      </AccordionHeader>
                    </ListItem>
                  </Link>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <Link to='/registrar/documents/requirements'>
                        <ListItem selected={route.pathname === '/registrar/documents/requirements' ? true : false}>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          <span className="mr-auto text-sm font-normal">
                            Requirements
                          </span>
                        </ListItem>
                      </Link>
                    </List>
                  </AccordionBody>
                </Accordion>
                <Accordion
                  open={open === 5}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${open === 5 ? "rotate-180" : ""}`}
                    />
                  }
                >
                  <Link to='/registrar/credentials'>
                    <ListItem selected={route.pathname === '/registrar/credentials' ? true : false} className="p-0">
                      <AccordionHeader onClick={() => handleOpen(5)} className="border-b-0 p-3">
                        <ListItemPrefix>
                          <DocumentTextIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <span className="mr-auto text-sm font-normal">
                          Credentials
                        </span>
                      </AccordionHeader>
                    </ListItem>
                  </Link>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <Link to='/registrar/credentials/purposes'>
                        <ListItem selected={route.pathname === '/registrar/credentials/purposes' ? true : false}>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          <span className="mr-auto text-sm font-normal">
                            Purposes
                          </span>
                        </ListItem>
                      </Link>
                      <Accordion
                        open={isOpen === 1}
                        icon={
                          <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${isOpen === 1 ? "rotate-180" : ""}`}
                          />
                        }
                      >
                        <ListItem className="p-0">
                          <AccordionHeader onClick={() => handleIsOpen(1)} className="border-b-0 p-3">
                            <ListItemPrefix>
                              <ArrowsRightLeftIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            <span className="mr-auto text-sm font-normal">
                              Requests
                            </span>
                          </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                          <List className="p-0">
                            <Link to='/registrar/credentials/requests/review'>
                              <ListItem selected={route.pathname === '/registrar/credentials/requests/review' ? true : false}>
                                <ListItemPrefix>
                                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                <span className="mr-auto text-sm font-normal">
                                  To Review
                                </span>
                              </ListItem>
                            </Link>
                            <Link to='/registrar/credentials/requests/pay'>
                              <ListItem selected={route.pathname === '/registrar/credentials/requests/pay' ? true : false}>
                                <ListItemPrefix>
                                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                <span className="mr-auto text-sm font-normal">
                                  To Pay
                                </span>
                              </ListItem>
                            </Link>
                            <Link to='/registrar/credentials/requests/process'>
                              <ListItem selected={route.pathname === '/registrar/credentials/requests/process' ? true : false}>
                                <ListItemPrefix>
                                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                <span className="mr-auto text-sm font-normal">
                                  In Process
                                </span>
                              </ListItem>
                            </Link>
                            <Link to='/registrar/credentials/requests/complete'>
                              <ListItem>
                                <ListItemPrefix>
                                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                <span className="mr-auto text-sm font-normal">
                                  Completed
                                </span>
                              </ListItem>
                            </Link>
                            <Link to='/registrar/credentials/requests/cancel'>
                              <ListItem>
                                <ListItemPrefix>
                                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                <span className="mr-auto text-sm font-normal">
                                  Cancelled
                                </span>
                              </ListItem>
                            </Link>
                          </List>
                        </AccordionBody>
                      </Accordion>
                    </List>
                  </AccordionBody>
                </Accordion>
              </List>
            )}
            {user.role === 'cashier' && (
              <List>
                <span className="font-medium text-sm py-2">Main</span>
                <Link to='/cashier/dashboard'>
                  <ListItem selected={route.pathname === '/cashier/dashboard' ? true : false}>
                    <ListItemPrefix>
                      <PresentationChartLineIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <span className="mr-auto text-sm font-normal">
                      Dashboard
                    </span>
                  </ListItem>
                </Link>
                <span className="font-medium text-sm py-2">Credentials</span>
                <Accordion
                  open={open === 2}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                    />
                  }
                >
                  <ListItem className="p-0">
                    <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                      <ListItemPrefix>
                        <ArrowsRightLeftIcon className="h-5 w-5" />
                      </ListItemPrefix>
                      <span className="mr-auto text-sm font-normal">
                        Requests
                      </span>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <Link to='/cashier/requests/pay'>
                        <ListItem selected={route.pathname === '/cashier/requests/pay' ? true : false}>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          <span className="mr-auto text-sm font-normal">
                            To Pay
                          </span>
                        </ListItem>
                      </Link>
                    </List>
                  </AccordionBody>
                </Accordion>
              </List>
            )}
          </Card>
          <div className="ml-[312px] py-4 pr-4">
            <div className="h-20 flex items-center justify-between">
              <div className="w-full max-w-[250px]">
                <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
              </div>
              <div className="flex items-center">
                <IconButton variant="text">
                  <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>
                <Badge>
                  <IconButton variant="text">
                    <BellIcon className="h-5 w-5" />
                  </IconButton>
                </Badge>
              </div>
            </div>
            <div className="mx-auto max-w-[1280px]">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default MSWDLayout