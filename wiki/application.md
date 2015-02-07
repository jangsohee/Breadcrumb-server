# Application

어플리케이션 데이터는 각각의 크롬 익스텐션을 구분하기 위해 사용된다. 각 크롬 익스텐션당 1개의 어플리케이션 도큐먼트를 갖는 것을 원칙으로 한다.

## 목차
1. [스키마](#schema)
1. [생성](#create)
1. [호출](#get)

## <a name="schema"></a> 스키마

```
{
    _id: 어플리케이션 오브젝트 아이디,
    rootHistories: [루트 히스토리 오브젝트 목록],
    registered: 등록일시,
    deleted: 삭제일시(삭제시만 포함)
}
```

## <a name="create"></a>생성

* method: POST
* path: /api/apps

헤더 정보가 존재하면 해당 어플리케이션 ID를, 존재하지 않는다면 새로운 어플리케이션 ID를 리턴한다.

### 리턴 데이터

```
{
    "code": 0,
    "status": 201,
    "message": "성공",
    "data": {
        "__v": 0,
        "registered": "2015-02-03T04:28:49.357Z",
        "_id": "54d04e8111d11e5357cd44c6",
        "rootHistories": []
    }
}
```

리턴 데이터의 `_id`값은 해당 어플리케이션의 ID값이다. 이 후 모든 서버로의 요청시 헤더에 다음과 같은 형태로 포함시켜야 한다.

```
'current-application': '54d04e8111d11e5357cd44c6'
```

이 헤더 정보는 현재 사용하는 어플리케이션이 어떤 것인지 판단하기 위해 필요한 정보이다.

## <a name="get"></a>호출

* header
    * current-application: 해당 어플리케이션 아이디 스트링
* method: GET
* path: /api/apps

어플리케이션 호출을 위해서는 반드시 `current-applicaton`헤더 정보가 존재해야 한다.
해당 어플리케이션의 데이터 및 전체 히스토리 트리구조를 리턴한다.
 - 현재 키워드 파트를 바인딩 하지 않아, 키워드(`keyword`)는 출력되지 않는다.

### 리턴 데이터

어플리케이션의 `_id`, `registered`, `rootHistories`를 출력한다.
`rootHistories`의 경우, 하위 트리 구조 모두를 포함한다.
`rootHistories`의 요소는 히스토리 오브젝트이며, `_id`, `registered`, `title`, `url`, `keyword`(미구현), `children`을 키로 갖는다.
`rootHistories`의 `children`은 히스토리 오브젝트 이며, `_id`, `registered`, `title`, `url`, `keyword`(미구현), `parent`, `children`을 키로 갖는다.

```
{
    "code": 0,
    "status": 200,
    "message": "성공",
    "data": {
        "_id": "54d3a641e2e3ff04189d20bd",
        "registered": "2015-02-05T17:20:01.298Z",
        "rootHistories": [
            {
                "_id": "54d3a64ae2e3ff04189d20be",
                "registered": "2015-02-05T17:20:10.938Z",
                "title": "hello",
                "url": "http://naver.com",
                "children": []
            },
            {
                "_id": "54d3a64de2e3ff04189d20bf",
                "registered": "2015-02-05T17:20:13.873Z",
                "title": "hello2",
                "url": "http://naver.com",
                "children": [
                    {
                        "_id": "54d5bad1540ba44d07c1f411",
                        "registered": "2015-02-05T17:20:24.170Z",
                        "title": "child",
                        "url": "http://naver.com",
                        "parent": "54d3a64de2e3ff04189d20bf",
                        "children": []
                    },
                    {
                        "_id": "54d3a659e2e3ff04189d20c1",
                        "registered": "2015-02-05T17:20:25.697Z",
                        "title": "child2",
                        "url": "http://naver.com",
                        "parent": "54d3a64de2e3ff04189d20bf",
                        "children": []
                    }
                ]
            }
        ]
    }
}
```
