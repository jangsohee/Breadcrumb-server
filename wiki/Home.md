# Breadcrumb 프로젝트 서버

## 목록

* [[유저|user]]
* [[어플리케이션|application]]
* [[히스토리|history]]
* [[키워드|keyword]]

### 공통 에러 리턴

오브젝트 아이디를 전송해야되는 키에 다른 타입의 데이터를 전송한 경우,
(기타 다른 타입 제한의 경우도 비슷하다.)

```
{
    "code": 5,
    "status": 422,
    "message": "Cast to ObjectId failed for value '전송한 밸류' at path '키'"
}
```