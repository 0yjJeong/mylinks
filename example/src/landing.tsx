import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoSmiley } from 'react-icons/go';
import Header from './components/header';
import useLazyLoad from './hooks/useLazyLoad';

import logo from './assets/logo.png';
import image from './assets/bg-image-1.jpg';

const Landing = () => {
  const [loaded, sources] = useLazyLoad([logo, image]);

  if (!loaded) return null;

  return (
    <div>
      <Header logo={sources[0]} />
      <div className='mt-36 px-3 md:flex'>
        <div className='text-center md:text-left m-auto'>
          <h1 className='mb-4 text-3xl md:text-5xl font-semibold'>
            수많은
            <strong className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 ml-3'>
              링크
            </strong>
            를 하나의 테이블에서 관리하세요!
          </h1>
          <h2 className='mb-4 text-base'>
            링크를 테이블 형식으로 관리하여 한 눈에 보기 쉽게 여러분의 링크
            목록을 관리할 수 있습니다.
          </h2>
          <Link to='/table'>
            <button className='px-4 py-2 rounded-md border-2 border-[#2C2C2C] text-[#2C2C2C] inline-flex items-center md:w-full hover:bg-[#2C2C2C] hover:text-white'>
              <div className='flex items-center mx-auto'>
                <span className='font-medium text-xl'>체험해보기</span>
                <span className='ml-2'>
                  <span>
                    <GoSmiley />
                  </span>
                </span>
              </div>
            </button>
          </Link>
          <div className='mt-20'>
            <div className='flex items-center gap-4'>
              <span className='w-full h-[1px] border-[1px] border-[#EEEEEE]' />
              or
              <span className='w-full h-[1px] border-[1px] border-[#EEEEEE]' />
            </div>
            <div className='mt-14'>
              <TableForm />
            </div>
          </div>
        </div>
        <div className='max-w-3xl m-auto md:flex-[50%]'>
          <img src={sources[1] ?? ''} />
        </div>
      </div>
    </div>
  );
};

const TableForm = () => {
  const [id, setId] = useState('');
  return (
    <form className='border-b-2 border-[#616161] flex'>
      <input
        className='px-4 pr-2 outline-none flex-1'
        placeholder='테이블 아이디를 입력하세요'
        onChange={(e) => {
          setId(e.target.value);
        }}
      />
      {
        <button className='text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 px-1 py-2'>
          <Link to={`/table/${id}`}>이동하기</Link>
        </button>
      }
    </form>
  );
};

export default Landing;
