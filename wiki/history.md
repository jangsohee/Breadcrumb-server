# History

## 목차
1. [스키마](#schema)
1. [생성](#create)

## <a name="schema"></a> 스키마

```
{
    _id: 히스토리 오브젝트 아이디,
    title: 제목 스트링,
    body: 본문 스트링,
    link: 링크 스트링(선택),
    url: 경로 스트링,
    keyword: {키워드 오브젝트},
    parent: {부모 히스토리 오브젝트},
    children: [자식 히스토리 오브젝트 목록]
    registered: 등록일시,
    deleted: 삭제일시(삭제시만 포함)
}
```

## 생성

* header
    * current-application: 해당 어플리케이션 아이디 스트링
* method: POST
* path: /api/histories
* data
    * title: 제목 스트링
    * body: 본문 스트링
    * link: 링크 스트링(선택)
    * url: 경로 스트링

히스토리 생성을 위해서는 반드시 `current-applicaton`헤더 정보가 존재해야 한다.
`title`, `body`, `url` 전송은 필수이며 `link`는 선택이다.

### 리턴 데이터

```
{
    "code": 0,
    "status": 201,
    "message": "성공",
    "data": {
        "_id": "54d050dc752f7cad570cb591",
        "title": "[기타]박태환 훈련재개...'평상시대로'",
        "body": "수영선수 박태환이 금지약물 검사에서 ...",
        "url": "http://news.naver.com?date=...",
        "keyword": {키워드 오브젝트},
        parent: {부모 히스토리 오브젝트},
        children: [],
        "registered": "2015-02-03T04:38:52.045Z",
        "__v": 0
    }
}
```

