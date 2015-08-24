# Application

어플리케이션 데이터는 각각의 크롬 익스텐션을 구분하기 위해 사용된다. 각 크롬 익스텐션당 1개의 어플리케이션 도큐먼트를 갖는 것을 원칙으로 한다.

## 목차
1. [스키마](#schema)
1. [이메일 검증](#email)
1. [로그인](#login)
1. [가입](#create)
1. [탈퇴](#remove)

## <a name="schema"></a> 스키마

```
{
    _id: 유저 오브젝트 아이디,
    role: 유저 권한(guest/user/editor/admin) 중 현재 user만 사용,
    nickname: 유저 닉네임 스트링,
    email: 유저 이메일 스트링
    hashedPassword: 암호화된 비밀번호 스트링,
    salt: 암호화 보조 키,
    application: 어플리케이션 오브젝트 아이디,
    registered: 가입일시,
    deleted: 탈퇴일시
}
```

## <a name="email"></a> 이메일 검증

* path: /api/users/email/:email
    * email: 검색할 이메일 스트링

해당 이메일의 형태를 검증하고, 이미 등록된 이메일인지 여부를 검증한다.

### 리턴 데이터

성공시 데이터를 포함하지 않는다.

```
{
    "code": 0,
    "status": 200,
    "message": "성공"
}
```

### 에러 리턴

잘못된 형태의 이메일을 전송한 경우,

```
{
    "code": 10212,
    "status": 422,
    "message": "이메일의 형식이 유효하지 않습니다."
}
```

이미 등록된 이메일을 입력한 경우,

```
{
    "code": 10213,
    "status": 422,
    "message": "이미 사용중인 이메일입니다."
}
```

## <a name="login"></a> 로그인

* method: POST
* path: /auth/local
* data
    * email: 유저 이메일 스트링,
    * password: 유저 비밀번호 스트링

유저 이메일과 비밀번호 검증 후, 인증 토큰을 리턴한다.
이 후 모든 서버로의 요청시 다음과 같은 형태로 인증 토큰을 헤더에 싣어야한다.

```
'Authorization': 'Bearer 인증_토큰'
```

이 헤더 정보는 현재 작업을 요청한 유저가 누구인지 판단하기 위해 필요한 정보이다.

### 리턴 데이터

```
{
    "code": 0,
    "status": 201,
    "message": "성공",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJfaWQiOiI1NGQ3OTczN2IwZGMyOWUyMDFkNjZmODIiLCJyb2xlIjoidXNlciIsImFwcGxpY2F0aW9uIjoiNTRkNzk3MzdiMGRjMjllMjAxZDY2ZjgxIiwiaWF0IjoxNDIzNDE4MTkwfQ.W2wSXAX50nB9K1uWVtBB8DTGF3Ib7yrNng19fQlacO_vDh4aDwVmWD5LHbF-MqR2-RzfBgY7VP7R1FrlQstpuApGzKtxmMYB3Xxdlt9RDLFPP63H_jPCHBTpydCRDIbRjsJxuhQJp0bH17GD-PSk0P1JYvl02aENAJUeWvFy_9U"
    }
}
```

### 에러 리턴

계정 정보가 존재하지 않는 경우(이메일이 등록되지 않았거나 탈퇴한 경우),

```
{
    "code": 10202,
    "status": 401,
    "message": "등록되지 않은 계정입니다."
}
```

잘못된 비밀번호를 입력한 경우,

```
{
    "code": 10216,
    "status": 403,
    "message": "잘못된 비밀번호가 입력되었습니다."
}
```

## <a name="create"></a> 가입

* method: POST
* path: /api/users
* data
    * email: 유저 이메일 스트링,
    * password: 유저 비밀번호 스트링,
    * nickname: 유저 닉네임 스트링

이메일은 유일해야 한다. 유저 생성 후, 인증 토큰을 리턴한다.
이 후 모든 서버로의 요청시 다음과 같은 형태로 인증 토큰을 헤더에 싣어야한다.

```
'Authorization': 'Bearer 인증_토큰'
```

이 헤더 정보는 현재 작업을 요청한 유저가 누구인지 판단하기 위해 필요한 정보이다.

### 리턴 데이터

```
{
    "code": 0,
    "status": 201,
    "message": "성공",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJfaWQiOiI1NGQ3OTczN2IwZGMyOWUyMDFkNjZmODIiLCJyb2xlIjoidXNlciIsImFwcGxpY2F0aW9uIjoiNTRkNzk3MzdiMGRjMjllMjAxZDY2ZjgxIiwiaWF0IjoxNDIzNDE4MTkwfQ.W2wSXAX50nB9K1uWVtBB8DTGF3Ib7yrNng19fQlacO_vDh4aDwVmWD5LHbF-MqR2-RzfBgY7VP7R1FrlQstpuApGzKtxmMYB3Xxdlt9RDLFPP63H_jPCHBTpydCRDIbRjsJxuhQJp0bH17GD-PSk0P1JYvl02aENAJUeWvFy_9U"
    }
}
```

### 에러 리턴

이메일이 누락된 경우,

```
{
    "code": 10211,
    "status": 422,
    "message": "이메일이 누락되었습니다."
}
```

잘못된 형태의 이메일을 전송한 경우,

```
{
    "code": 10212,
    "status": 422,
    "message": "이메일의 형식이 유효하지 않습니다."
}
```

이미 등록된 이메일을 입력한 경우,

```
{
    "code": 10213,
    "status": 422,
    "message": "이미 사용중인 이메일입니다."
}
```

비밀번호가 누락된 경우,

```
{
    "code": 10214,
    "status": 422,
    "message": "비밀번호가 누락되었습니다."
}
```

비밀번호가 기준(현재 4 글자) 보다 짧은 경우,

```
{
    "code": 10215,
    "status": 422,
    "message": "비밀번호가 너무 짧습니다."
}
```

닉네임이 누락된 경우,

```
{
    "code": 10217,
    "status": 422,
    "message": "닉네임이 누락되었습니다."
}
```

## <a name="remove"></a> 탈퇴

* header
    * Authorization: 유저 Bearer 토큰
* method: DELEE
* path: /api/users
* data
    * password: 비밀번호 검증에 필요한 기존 비밀번호 스트링

유저 탈퇴를 위해서는 반드시 `Authorization`헤더 정보가 존재해야 한다.
또한 전달된 `password`는 기존의 비밀번호와 반드시 일치해야 한다.

### 리턴 데이터

성공시 데이터를 포함하지 않는다.

```
{
    "code": 0,
    "status": 201,
    "message": "성공"
}
```
