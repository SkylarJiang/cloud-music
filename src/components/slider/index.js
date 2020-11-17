import React, { useEffect, useState } from 'react';
import { SliderContainer } from './style';
import 'swiper/css/swiper.min.css';
import Swiper from 'swiper';

function Slider(props) {
    const [sliderSwiper, setSliderSwiper] = useState(null);
    const { bannerList } = props;

    useEffect(() => {
        if (bannerList.length && !sliderSwiper) {
            let newSliderSwiper = new Swiper('.slider-container', {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  },
            });
            // 这行是什么呀
            setSliderSwiper(newSliderSwiper)
            // 这个是 hook 的基本用法啦，括号里的内容就是要 set 成的部分
        }
    }, [bannerList, sliderSwiper]);
    //hook 中 useEffect 是在每次更新的时候都会重新渲染，而后面的数组中的变量是用于过滤更新条件的

    return (
        <SliderContainer>
            <div className="before"></div> 
            <div className='slider-container'>
                <div className='swiper-wrapper'>
                    
                    {
                        bannerList.map(slider => {
                            return (
                                // 整一个slider（四合一）
                                <div className='swiper-slide' key={slider.imageUrl}>
                                    <div className='slider-nav'>
                                        <img src={slider.imageUrl} width='100%' height='100%' alt='推荐' />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='swiper-pagination'></div>
            </div>
        </SliderContainer>
    );
}
export default React.memo(Slider);