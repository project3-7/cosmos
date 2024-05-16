// import classNames from 'classnames/bind';
// import { useState } from 'react';
// import styles from './ProfilePopOver.module.scss';
// import * as Icon from '@/components/Common/IconCollection';
// import DeleteModal from '../../../Common/DeleteModal';
// import { useDispatch } from 'react-redux';
// import { memberLogout } from '@/api/member';
// import { logout } from '@/redux/logoutSlice';
// import router from 'next/router';
// import PopOver from '../../../Common/PopOverBox';

// const cn = classNames.bind(styles);

// interface PopOverProps {
//   onClose: () => void;
//   onSetting: () => void;
// }

// export default function ProfilePopOver({ onClose, onSetting }: PopOverProps) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);

//   const ExpandHandler = () => {
//     if (isExpanded) {
//       setIsExpanded(false);
//     } else {
//       setDeleteModal(false);
//       setIsExpanded(true);
//     }
//   };
//   const dispatch = useDispatch();

//   const memberLogoutClick = async () => {
//     const res = await memberLogout();
//     dispatch(logout());
//     router.push('/');
//   };

//   return (
//     <div className={cn('wrapper')}>
//       <Icon.DropDown onClick={ExpandHandler} />

//       {isExpanded && (
//         <PopOver onClose={onClose}>
//           <ul className={cn('expanded-popover-container')}>
//             <li
//               role="presentation"
//               className={cn('content-list', 'profile-edit')}
//               onClick={(e) => {
//                 onSetting();
//                 e.stopPropagation();
//                 setIsExpanded(false);
//               }}
//             >
//               <Icon.SettingIcon width="18" height="18" fill="#C2C7D9" />
//               <span>프로필 수정</span>
//             </li>
//             <li
//               role="presentation"
//               className={cn('content-list', 'logout')}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setDeleteModal(true);
//               }}
//             >
//               <Icon.LogoutIcon width="18" height="18" fill="#FFFFFF" />
//               로그아웃
//             </li>
//           </ul>
//           <DeleteModal
//             isDeleteModalOpen={deleteModal}
//             setIsDeleteModalOpen={setDeleteModal}
//             handleDelete={memberLogoutClick}
//             title="로그아웃"
//             deleteText="로그아웃"
//           />
//         </PopOver>
//       )}
//     </div>
//   );
// }

import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import styles from './ProfilePopOver.module.scss';
import * as Icon from '@/components/Common/IconCollection';
import DeleteModal from '@/components/Common/DeleteModal';
import { useDispatch } from 'react-redux';
import { memberLogout } from '@/api/member';
import { logout } from '@/redux/logoutSlice';
import router from 'next/router';
import ReactDOM from 'react-dom';
import { MemberDataType } from '@/pages/profile/types';
import AuthForm from '../../AuthForm';

const cn = classNames.bind(styles);

interface ProfileSettingDropdownProps {
  onSetting: () => void;
  memberData: MemberDataType;
}

/**
 * @param {Function} onSetting : 설정 버튼 클릭 시 동작할 로직
 */

export type ProfileSettingType = 'EDIT' | 'LOGOUT';

export default function ProfilePopOver({
  onSetting,
  memberData,
}: ProfileSettingDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const ExpandHandler = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setDeleteModal(false);
      setIsExpanded(true);
    }
  };

  const dispatch = useDispatch();

  const memberLogoutClick = async () => {
    const res = await memberLogout();
    dispatch(logout());
    router.push('/').then(() => {
      window.location.reload();
    });
  };

  // 케밥 버튼에 팝오버 딱 고정시켜서 붙이기..............ㅠ
  const profilePopoverRef = useRef(null);
  const iconRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isExpanded && profilePopoverRef.current && iconRef.current) {
      const profilePopover = profilePopoverRef.current as HTMLElement;
      const kebabButtonRect = iconRef.current.getBoundingClientRect();
      if (kebabButtonRect) {
        profilePopover.style.position = 'absolute';
        profilePopover.style.top = `${kebabButtonRect.bottom}px`;
        profilePopover.style.left = `${kebabButtonRect.left - 90}px`;
      }
      console.log('kebabButtonRect', kebabButtonRect);
      console.log('profilePopover', profilePopover);
    }
  }, [isExpanded]);
  // isExpanded가 변경될 때마다 실행

  const authorizationButton = {};

  const authFormClick = () => {
    setShowAuthForm(!showAuthForm);
  };

  return (
    <div className={cn('wrapper')}>
      <div className={cn('icon')} ref={iconRef}>
        <Icon.DropDown onClick={ExpandHandler} />
      </div>
      {isExpanded &&
        ReactDOM.createPortal(
          <ul
            ref={profilePopoverRef}
            onClick={ExpandHandler}
            className={cn('expanded-dropdown-container')}
            role="presentation"
          >
            {memberData.authorizationStatus === 'NONE' && (
              <li
                onClick={() => {
                  onSetting();
                  setIsExpanded(false);
                }}
                className={cn('expanded-dropdown-list', 'profile-edit')}
              >
                <Icon.SettingIcon width="18" height="18" fill="#C2C7D9" />
                프로필 수정
              </li>
            )}
            {memberData.authorizationStatus === 'ACCEPT' && (
              <>
                <li
                  onClick={authFormClick}
                  className={cn('expanded-dropdown-list', 'profile-edit')}
                >
                  <Icon.Certification width="18" height="18" />
                  인증하기
                </li>
                <AuthForm
                  modalVisible={showAuthForm}
                  toggleModal={authFormClick}
                />
              </>
            )}
            {memberData.authorizationStatus === 'PENDING' && (
              <>
                <li
                  onClick={authFormClick}
                  className={cn('expanded-dropdown-list', 'profile-edit')}
                >
                  인증하기
                </li>
                <AuthForm
                  modalVisible={showAuthForm}
                  toggleModal={authFormClick}
                />
              </>
            )}

            <li
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModal(true);
              }}
              className={cn('expanded-dropdown-list', 'logout')}
            >
              <Icon.LogoutIcon width="18" height="18" fill="#FFFFFF" />
              로그아웃
            </li>
          </ul>,
          document.getElementById('profile-popover-box') as HTMLElement,
        )}
      <DeleteModal
        isDeleteModalOpen={deleteModal}
        setIsDeleteModalOpen={setDeleteModal}
        handleDelete={memberLogoutClick}
        title="로그아웃"
        deleteText="로그아웃"
      />
    </div>
  );
}