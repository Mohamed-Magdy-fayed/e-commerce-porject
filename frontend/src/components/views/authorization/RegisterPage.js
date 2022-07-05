import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addUserAction } from '../../../context/store/StoreActions'
import StoreContext from '../../../context/store/StoreContext'
import { useProtect } from '../../../hooks/useProtect'
import RegisterForm from '../../shared/forms/RegisterForm'

const RegisterPage = () => {
    useProtect()

    const { loginUser, showToast } = useContext(StoreContext)
    const navigate = useNavigate()

    // Form On Submit
    const registerUser = async (formStates) => {

        if (formStates.password !== formStates.passwordConfirm) {
            showToast(`Passwords don't match!`, false)
            return
        }

        const userData = {
            firstName: formStates.firstName,
            lastName: formStates.lastName,
            email: formStates.email,
            password: formStates.password,
            address: formStates.address,
            phone: formStates.phone,
            type: formStates.type,
            status: formStates.status,
        }

        /* Send data to API to register a new user */
        await addUserAction(userData).then(res => {
            if (res.error) return showToast(res.error, false)

            const storage = {
                id: res.user._id,
                token: res.token
            }

            localStorage.setItem('token', JSON.stringify(storage))
            const data = {
                user: res.user,
                token: res.token,
            }
            loginUser(data)

            /*redirect to Home page */
            navigate('/')
        })
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        {/* Logo */}
                        <div className="ml-4 flex lg:ml-0 justify-center">
                            <Link to="/">
                                <span className="sr-only">Home</span>
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                                    alt=""
                                />
                            </Link>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
                        <div className='flex flex-col items-center mt-4 space-y-0'>
                            <p>
                                Already have an account?
                            </p>
                            <Link to='/login' type='button' className="mt-5 font-medium text-indigo-600 hover:text-indigo-500">
                                Log in
                            </Link>
                        </div>
                    </div>
                    <RegisterForm onSubmit={registerUser} withPW={true} />
                </div>
            </div>
        </>
    )
}

export default RegisterPage