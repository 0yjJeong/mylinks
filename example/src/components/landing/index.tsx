import { Link, useNavigate } from 'react-router-dom';
import {
  RiTableAltLine,
  RiSingleQuotesL,
  RiSingleQuotesR,
  RiErrorWarningFill,
} from 'react-icons/ri';
import useLazyLoad from '../../hooks/useLazyLoad';

// images
import logo from '../../assets/logo.png';
import logoWithText from '../../assets/logo-with-text.png';

const Landing = () => {
  const navigate = useNavigate();
  const [loaded, sources] = useLazyLoad([logo, logoWithText]);

  if (!loaded) return null;

  return (
    <div className='max-w-6xl m-auto'>
      <header className='flex items-center justify-between px-6 py-4'>
        <div>
          <img src={sources[1]} className=' h-6 sm:h-[37px]' />
        </div>
        <aside>
          <Link to='/table'>
            <button className='flex items-center gap-2 bg-[#D01212] hover:bg-[#a30303] text-white px-4 py-2 rounded-md'>
              <RiTableAltLine stroke='#D01212' />
              <span>체험하기</span>
            </button>
          </Link>
        </aside>
      </header>
      <div className='relative px-6 py-4 mb-10'>
        <div className='pt-44'>
          <h1 className='text-4xl leading-10 sm:leading-[80px] sm:text-6xl text-center font-bold leading-18'>
            수많은
            <RiSingleQuotesL
              color='#ed3939'
              className='inline align-baseline animate-bounce'
            />
            <strong className='bg-clip-text text-transparent bg-gradient-to-r from-[#ed3939] to-[#D01212]'>
              링크
            </strong>
            <RiSingleQuotesR
              color='#ed3939'
              className='inline align-baseline animate-bounce'
            />
            를 하나의 테이블에서 관리할 수 있습니다
          </h1>
          <h2 className='text-center text-lg sm:text-xl text-[#454545] mt-7 sm:max-w-2xl mx-auto'>
            Mylinks는 링크 관리 프로그램입니다. 새로운 링크를 추가하고 편집할 수
            있으며 언제든지 선택한 링크를 삭제할 수 있습니다.
          </h2>
          <div className='bg-[radial-gradient(at_center,_#ffe8e8,_#ffe8e8,_#fff,_#fff,_#fff)] absolute top-0 bottom-0 right-0 left-0 -z-10' />
        </div>
        <ul className='flex mt-10 justify-center gap-3'>
          {[
            { title: '생상성', icon: '⚙️' },
            { title: '효율성', icon: '⌛️' },
            { title: '편리함', icon: '💡' },
          ].map((el) => (
            <li
              key={el.title}
              className='shadow bg-white w-32 rounded relative after:content-[""] after:block after:pb-[100%]'
            >
              <div className='absolute w-full h-full flex flex-col gap-2 justify-center items-center'>
                <div>{el.icon}</div>
                <div>{el.title}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='px-6 py-20'>
        <div className='bg-[#fff2f2] text-center p-6 rounded-lg'>
          <h3 className='text-2xl font-bold text-[#D01212]'>
            이미 테이블을 생성하였습니까?
          </h3>
          <p className='mt-1 text-base'>
            테이블 ID를 입력해서 해당 테이블로 이동하세요.
          </p>
          <img src={sources[0]} className='w-[47px] inline-block mt-6' />
          <p className='text-xs text-[#f77272] italic flex justify-center items-center gap-1 mt-6'>
            <RiErrorWarningFill />
            아이디는 UUID 형식이어야 합니다.
          </p>
          <form
            className='flex flex-col sm:flex-row justify-center mt-6'
            onSubmit={(e) => {
              e.preventDefault();
              const { value } = (e.target as any).id;
              navigate(`/table/${value}`);
            }}
          >
            <input
              name='id'
              className='outline-none px-5 py-3 rounded sm:w-2/4'
            />
            <button
              type='submit'
              className='bg-[#D01212] text-white px-3 py-2 rounded mt-2 sm:mt-0 sm:ml-3'
            >
              이동
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Landing;
