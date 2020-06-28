import * as _ from 'lodash/fp'

describe('ch5 real code 1', ()=>{
  const USERS = [
    {id: 101, name: 'ID'},
    {id: 102, name: 'BJ'},
    {id: 103, name: 'PJ'},
    {id: 104, name: 'HA'},
    {id: 105, name: 'JE'},
    {id: 106, name: 'JI'}
  ]

  const POSTS = [
    {id: 201, body: 'body1', userId: 101},
    {id: 202, body: 'body2', userId: 102},
    {id: 203, body: 'body3', userId: 103},
    {id: 204, body: 'body4', userId: 102},
    {id: 205, body: 'body5', userId: 101},
  ]

  const COMMENTS = [
    {id: 301, body: '댓글1', userId: 105, postId: 201},
    {id: 302, body: '댓글2', userId: 104, postId: 201},
    {id: 303, body: '댓글3', userId: 104, postId: 202},
    {id: 304, body: '댓글4', userId: 105, postId: 203},
    {id: 305, body: '댓글5', userId: 106, postId: 203},
    {id: 306, body: '댓글6', userId: 106, postId: 204},
    {id: 307, body: '댓글7', userId: 102, postId: 205},
    {id: 308, body: '댓글8', userId: 103, postId: 204},
    {id: 309, body: '댓글9', userId: 103, postId: 202},
    {id: 310, body: '댓글10', userId: 105, postId: 201},
  ]

  test('실전 코드', ()=>{
    // 1. 특정인의 posts의 모든 comments 거르기
    const getPostsBy = (attr) => _.filter(attr, POSTS)

    const getCommentsByPosts = _.flow(
      _.pluck('id'),
      postIds=>_.filter(comment=>{
        return _.includes(comment.postId, postIds)
      }, COMMENTS)
    )

    const f1 = _.flow(
      getPostsBy,
      getCommentsByPosts
    )

    expect(f1({userId: 101})).toMatchObject([
      { id: 301, body: '댓글1', userId: 105, postId: 201 },
      { id: 302, body: '댓글2', userId: 104, postId: 201 },
      { id: 307, body: '댓글7', userId: 102, postId: 205 },
      { id: 310, body: '댓글10', userId: 105, postId: 201 }
    ])

    // 2. 특정인의 posts에 comments를 단 친구의 이름들 뽑기
    const userNamesByComments = _.map(comment=>(_.find(user=>comment.userId===user.id, USERS).name))

    const f2 = _.flow(
      f1,
      userNamesByComments,
      _.uniq
    )

    expect(f2({userId: 101})).toMatchObject(['JE', 'HA', 'BJ'])

    // 3. 특정인의 posts에 comments를 단 친구들 카운트 정보
    const f3 = _.flow(
      f1,
      userNamesByComments,
      _.countBy(_.identity)
    )

    expect(f3({userId: 101})).toMatchObject({BJ: 1, HA: 1, JE: 2})

    // 4. 특정인의 comment를 단 posts 거르기
    const getCommentsBy = (attr) => _.filter(attr, COMMENTS)

    const f4 = _.flow(
      getCommentsBy,
      _.pluck('postId'),
      _.uniq,
      postIds=>_.filter(post=>_.includes(post.id, postIds), POSTS)
    )

    expect(f4({userId: 105})).toMatchObject([
      { id: 201, body: 'body1', userId: 101 },
      { id: 203, body: 'body3', userId: 103 }
    ])
  })

  test('효율성 높이기', ()=>{
    // 5. USERS + POSTS + COMMENTS(index_by와 group_by로 효율 높이기)
    const USERS_INDEX = _.indexBy(user=>user.id, USERS)

    const COMMENTS2 = _.map(comment=>{
      return _.extend({
        user: USERS_INDEX[comment.userId]
      }, comment)
    }, COMMENTS)
    const COMMENTS2_GROUP =  _.groupBy(comment=>comment.postId, COMMENTS)

    const POSTS2 = _.map(post=>{
      return _.extend({
        user: USERS_INDEX[post.userId],
        comments: COMMENTS2_GROUP[post.id] || []
      }, post)
    }, POSTS)
    const POSTS2_GROUP =  _.groupBy(post=>post.userId, POSTS)

    const USERS2 = _.map(user=>{
      return _.extend({
        posts: POSTS2_GROUP[user.id] || []
      }, user)
    }, USERS_INDEX)

    // 5.1 특정인의 posts의 모든 comments거르기
    const f5_1 = _.flow(
      userId => (_.find(user=>user.id===userId, USERS2)).posts,
      _.flatMap(post=>post.comments)
    )

    // TODO: Test case 추가

    // expect().toMatchObject([
    //   {user: [Object], id: 301, body: '댓글1', userId: 105, postId: 201 },
    //   { user: [Object], id: 302, body: '댓글2', userId: 104, postId: 201 },
    //   { user: [Object], id: 310, body: '댓글10', userId: 105, postId: 201 },
    //   { user: [Object], id: 307, body: '댓글7', userId: 102, postId: 205 }
    // ])

    // 5.2 특정인의 posts에 comments를 단 친구의 이름들 뽑기
    const f5_2 = _.flow(
      f5_1,
      _.pluck('user.name'),
      _.uniq
    )
    // TODO: Test case 추가

    // 5.3 특정인의 posts에 comments를 단 친구들 카운트 정보
    const f5_3 = _.flow(
      f5_1,
      _.pluck('user.name'),
      _.countBy(_.identity),
    )
    // TODO: Test case 추가

    // 5.4 특정인의 comment를 단 posts거르기
    const f5_4 = userId => _.filter(post=>{
      return _.find(comment=>comment.userId===userId, post.comments)
    }, POSTS2)
    // TODO: Test case 추가
  })
})