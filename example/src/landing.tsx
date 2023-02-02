import { Link } from 'react-router-dom';
import { GoSmiley } from 'react-icons/go';
import Header from './components/header';

import image from './assets/bg-image-1.jpg';

const Landing = () => {
  return (
    <div>
      <Header />
      <div className='mt-24 px-3 md:flex'>
        <div className='text-center md:text-left m-auto'>
          <h1 className='mb-4 text-3xl md:text-5xl font-semibold'>
            수많은
            <strong className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 ml-3'>
              링크
            </strong>
            를 하나의 테이블에서 관리하세요!
          </h1>
          <h2 className='mb-4 text-base'>
            링크를 그저 저장하는 것이 아닌 테이블 형식으로 관리하여 한 눈에 보기
            쉽게 링크 리스트를 관리할 수 있습니다.
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
        </div>
        <div className='max-w-3xl mt-4 md:mt-0'>
          <img src={image} />
        </div>
      </div>
    </div>
  );
};

export default Landing;
