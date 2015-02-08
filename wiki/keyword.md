# Keyword

키워드 데이터는 각 어플리케이션 별 유니크한 명사를 나타내는 데이터이다.

## 목차
1. [스키마](#schema)

## <a name="schema"></a> 스키마

```
{
    _id: 키워드 오브젝트 아이디,
    application: 어플리케이션 오브젝트 아이디,
    noun: 명사 키워드 스트링,
    nounType: 해당 키워드의 타입,
    count: 누적 카운트
    registered: 등록일시
}
```
