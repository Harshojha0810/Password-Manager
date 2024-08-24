import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef()
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])
    const passwordRef = useRef()

    const getPasswords = async ()=>{
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])



    const showPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        } else {
            ref.current.src = "icons/eyecross.png"
            passwordRef.current.type = "text"
        }
    }

    const savePassword = async() => {
        if(form.site.length > 3 && form.username.length > 3 && form.password.length >3 ) {
             await fetch("http://localhost:3000/",{method:"DELETE", headers: {"content-type":"application/json"}, body: JSON.stringify({id:form.id}) }) 
        setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
         await fetch("http://localhost:3000/",{method:"POST", headers: {"content-type":"application/json"}, body: JSON.stringify({...form, id:uuidv4() }) })
       
        setForm({ site: "", usernam: "", password: "" })
        toast('Password Saved!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
            });
        }else {
            toast('Error:Password not saved!')
        }
    }

    const deletePassword = async (id) => {
        console.log("deleting password with id", id);
        let c = confirm("Do you really want to delete this password?")
        if (confirm) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))

            let res = await fetch("http://localhost:3000/",{method:"DELETE", headers: {"content-type":"application/json"}, body: JSON.stringify({ id}) }) 
           
            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
                });
        }

    }

    const editPassword = (id) => {
        console.log("Editing password with id", id);
        setForm({...passwordArray.filter(i => i.id === id)[0], id:id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))

    }


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const copyText = (text) => {
        toast('Copied to Clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
            });
            
        navigator.clipboard.writeText(text);
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Same as */}
            <ToastContainer />

            <div className="absolute inset-0 -z-10 h-full w-full bg-green-100 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div>
            <div className="p-3 md:mycontainer min-h-[82.3vh] ">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>
                    Pass
                    <span className='text-green-500'>OP/&gt;</span>

                </h1>
                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>
                <div className=' flex flex-col p-4 text-black gap-8 items-center'>
                    <input onChange={handleChange} value={form.site} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type='text' name='site' id='site' />
                    <div className='flex flex-col md:flex-row w-full justify-content gap-8'>
                        <input onChange={handleChange} value={form.username} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type='text' name='username' id='username' />
                        <div className="relative">
                            <input ref={passwordRef} onChange={handleChange} value={form.password} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type='password' name='password' id='password' />
                            <span className='absolute right-[5px] top-[4px]
                        cursor-pointer'onClick={showPassword}><img ref={ref} className="p-1" width={26} src="icons/eye.png" alt="" /></span>
                        </div>

                    </div>
                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save</button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold text-xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No Password to show </div>}
                    {passwordArray.length != 0 &&
                        <table className="table-auto w-full rounded-md overflow-hidden mb-8">
                            <thead className=' bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className="py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index}>
                                        <td className=' flex items-center justify-center py-2 px-10 border-white text-center '><a href={item.site} target='_blank'>{item.site}</a>
                                            <div className='cursor-pointer' onClick={() => { copyText(item.site) }}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", "paddingTop": "7px", "paddingLeft": "5px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </td>

                                        <td className=' cursor-pointer justif-center  py-2 border-white text-center ' onClick={() => { copyText(item.username) }}>{item.username}
                                            <lord-icon
                                                style={{ width: "25px", height: "25px", "paddingLeft": "5px", "paddingTop": "10px" }}
                                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                                trigger="hover" >
                                            </lord-icon>

                                        </td>

                                        <td className='cursor-pointer  py-2 border-white text-center ' onClick={() => { copyText(item.password) }} >{item.password}
                                            <lord-icon
                                                style={{ width: "25px", height: "25px", "paddingTop": "8px", "paddingLeft": "10px" }}
                                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                                trigger="hover" >
                                            </lord-icon>
                                        </td>
                                        <td className=' justify-centter py-2 border-white text-center'>
                                            <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }} >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "10px" }} >
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "7px" }} >
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>}
                </div>

            </div>
        </>
    )
}

export default Manager
