import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, List, Card, Icon } from 'antd';
import NicknameEditForm from '../containers/NicknameEditForm';
import {
	UNFOLLOW_USER_REQUEST,
	REMOVE_FOLLOWER_REQUEST,
	LOAD_FOLLOWERS_REQUEST,
	LOAD_FOLLOWINGS_REQUEST,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';
import FollowList from '../component/FollowList';

const Profile = () => {
	const dispatch = useDispatch();
	const { followerList, followingList, hasMoreFollower, hasMoreFollowing } = useSelector(
		(state) => state.user,
	);
	const { mainPosts } = useSelector((state) => state.post);

	const onUnfollow = useCallback(
		(userId) => () => {
			dispatch({
				type: UNFOLLOW_USER_REQUEST,
				data: userId,
			});
		},
		[],
	);

	const onRemoveFollow = useCallback(
		(userId) => () => {
			dispatch({
				type: REMOVE_FOLLOWER_REQUEST,
				data: userId,
			});
		},
		[],
	);

	const loadMorefollowings = useCallback(() => {
		dispatch({
			type: LOAD_FOLLOWINGS_REQUEST,
			offset: followingList.length,
		});
	}, [followingList.length]);

	const loadMorefollowers = useCallback(() => {
		dispatch({
			type: LOAD_FOLLOWERS_REQUEST,
			offset: followerList.length,
		});
	}, [followerList.length]);

	return (
		<div>
			<NicknameEditForm />
			{/* grid: 아이탬글 간의 간격 조정 */}

			<FollowList
				header="팔로잉 목록"
				hasMore={hasMoreFollowing}
				onClickMore={loadMorefollowings}
				data={followingList}
				onClickStop={onUnfollow}
			/>
			<FollowList
				header="팔로워 목록"
				hasMore={hasMoreFollower}
				onClickMore={loadMorefollowers}
				data={followerList}
				onClickStop={onRemoveFollow}
			/>

			<div>
				{mainPosts.map((c) => {
					return <PostCard key={c.createdAt} post={c} />;
				})}
			</div>
		</div>
	);
};

Profile.getInitialProps = async (context) => {
	const state = context.store.getState();
	// 이 직전에 LOAD_USERS_REQUEST
	context.store.dispatch({
		type: LOAD_FOLLOWERS_REQUEST,
		data: state.user.me && state.user.me.id,
	});
	context.store.dispatch({
		type: LOAD_FOLLOWINGS_REQUEST,
		data: state.user.me && state.user.me.id,
	});
	context.store.dispatch({
		type: LOAD_USER_POSTS_REQUEST,
		data: state.user.me && state.user.me.id,
	});

	// 이 쯤에서 LOAD_USERS_SUCCESS 돼서 me가 생김.
};

export default Profile;
