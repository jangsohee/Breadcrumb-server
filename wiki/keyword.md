# Keyword

키워드 데이터는 각 어플리케이션 별 유니크한 명사를 나타내는 데이터이다.

## 목차
1. [스키마](#schema)

## <a name="schema"></a> 스키마

```
{
    _id: 어플리케이션 오브젝트 아이디,
    application: 어플리케이션 오브젝트 아이디,
    noun: 명사 키워드 스트링
    count: 누적 카운트
    registered: 등록일시,
    deleted: 삭제일시(삭제시만 포함)
}
```
