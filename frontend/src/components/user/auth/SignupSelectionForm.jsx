import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import InputField from '../../ui/InputField';
import Loader from '../../ui/Loader';
import { useRecoilState } from 'recoil';
import { signUpDataAtom } from '../../../store/atoms/userAtoms';

const SignupSelectionForm = ({ handleEmailSubmit, isLoading }) => {
  const [signupData, setSignupData] = useRecoilState(signUpDataAtom);
  const navigate = useNavigate();

  function handleGuest() {
    localStorage.setItem('guest-account', true);
    navigate('/dashboard');
  }

  return (
    <>
      <h2 className="mb-4 mt-2 text-center text-3xl font-semibold">
        Create an account
      </h2>
      <form onSubmit={handleEmailSubmit} className="mt-3">
        <InputField
          type="email"
          placeholder="Email"
          value={signupData.email}
          isRequired={true}
          styles={'!bg-[#262626] my-4'}
          onChange={(e) =>
            setSignupData({ ...signupData, email: e.target.value })
          }
        />
        <Button type="submit" Content={isLoading ? <Loader /> : 'Continue'} />
        <div className="mb-2 mt-7 flex w-full items-center gap-3 text-xs opacity-70">
          <span className="h-1 flex-1 border-t border-[#404040]"></span>
          <p>or</p>
          <span className="h-1 flex-1 border-t border-[#404040]"></span>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={handleGuest}
          Content={'Continue as Guest'}
          styles={
            '!bg-black-light  outline outline-black-black !text-white !text-sm !font-medium'
          }
        />
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </>
  );
};

export default SignupSelectionForm;
