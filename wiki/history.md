# History

## 생성

* header
    * current-application: 해당 어플리케이션 아이디 스트링
* method: POST
* path: /api/histories
* data
    * title: 제목 스트링
    * body: 본문 스트링
    * aTag: 태그 스트링
    * metaKeywords: 메타 키워드 스트링 목록

히스토리 생성을 위해서는 반드시 `current-applicaton`헤더 정보가 존재해야 한다.
`title`, `body`, `aTag`, `metaKeywords` 전송이 필수로 이뤄져야 한다.

### 리턴 데이터

```
{
    "code": 0,
    "status": 201,
    "message": "성공",
    "data": {
        "__v": 0,
        "title": "[기타]박태환 훈련재개...'평상시대로'",
        "body": "수영선수 박태환이 금지약물 검사에서 ...",
        "aTag": "박태환 훈련재개...'평상시대로'",
        "registered": "2015-02-03T04:38:52.045Z",
        "_id": "54d050dc752f7cad570cb591",
        "metaKeywords": [
            "스포츠",
            "운동선수"
        ]
    }
}
```

