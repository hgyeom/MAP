import { React, useEffect, useState, useCallback, useRef } from 'react';
import * as S from './StyledDetail';
import { getPlacesForKakao, onClickSpotCreateMarker } from '../../api/kakao';
import noImage from '../../assets/noimage.png';
import { ReactComponent as Spinner } from '../../assets/Spinner.svg';
import useInfiniteScoll from '../../hooks/useInfiniteScroll';
import { useSelector, useDispatch } from 'react-redux';
import { setIsMarkedMarked } from '../../redux/modules/kakao';
import { fecthTourPlaces, fecthTourPlacesBasedAreaCode, setPlace } from '../../redux/modules/tourPlaces';

function List({ place }) {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const { tourPlaces, loading, nothing } = useSelector((state) => state.tourPlacesReducer);
  const { kakao, kakaoLoading, isMarked, isMarkedMarked } = useSelector((state) => state.kakaoReducer);

  const [page, setPage] = useState(1);

  const markMap = () => {
    setPage(() => {
      return 1;
    });
    dispatch(setPlace([]));
  };

  if (isMarked && !isMarkedMarked) {
    markMap();
    dispatch(setIsMarkedMarked());
  }

  const increasePage = useCallback(() => {
    setPage((prev) => {
      return prev + 1;
    });
  });

  const [observe, unobserve] = useInfiniteScoll(increasePage);

  useEffect(() => {
    unobserve(ref.current);
    markMap();
  }, [kakao]);

  useEffect(() => {
    const fetchPlaces = () => {
      dispatch(
        fecthTourPlaces({
          contentTypeId: '12',
          arrange: 'A',
          mapX: kakao.mapX,
          mapY: kakao.mapY,
          radius: '5000',
          pageNo: page,
          ob: () => observe(ref.current),
          unob: () => unobserve(ref.current)
        })
      );
    };

    const fetchPlacesBasedAreaCode = () => {
      dispatch(
        fecthTourPlacesBasedAreaCode({
          contentTypeId: '12',
          arrange: 'A',
          areaCode: place.areaCode,
          sigunguCode: place.sigunguCode,
          pageNo: page,
          ob: () => observe(ref.current),
          unob: () => unobserve(ref.current)
        })
      );
    };

    if (!isMarked) {
      fetchPlacesBasedAreaCode();
    } else {
      fetchPlaces();
      // getPlacesForKakao(tourPlaces);
    }
  }, [page, isMarked, kakao]);

  return (
    <S.detailPlaceList>
      <div className="rec-div">
        <p>추천장소</p>
      </div>
      <S.spotList>
        {tourPlaces.length > 1
          ? tourPlaces.map((item) => {
              return (
                <S.spotCard
                  key={item.contentid}
                  onClick={() => onClickSpotCreateMarker(item.mapy, item.mapx, item.title)}
                >
                  <S.spotImage>
                    {item.firstimage ? (
                      <img src={item.firstimage} alt="명소 이미지" />
                    ) : (
                      <img src={noImage} alt="이미지 없음" />
                    )}
                  </S.spotImage>
                  <div>
                    <S.StTitle>{item.title}</S.StTitle>
                    <S.StDesc>{item.addr1}</S.StDesc>
                  </div>
                </S.spotCard>
              );
            })
          : nothing && <>없습니다</>}

        <div className="ob-div" ref={ref}>
          {loading && <Spinner />}
        </div>
      </S.spotList>
    </S.detailPlaceList>
  );
}
export default List;
