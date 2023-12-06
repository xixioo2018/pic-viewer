import { useEffect, useState } from 'react';
import { Card, Flex, Space, Tag } from 'antd';
import axios from 'axios';

const { Meta } = Card;

const App = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false); // 加载状态
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const mergeData = (data: any[], newData: any[]) => {
    const d = [...data, ...newData];
    setData(d);
  }

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      // 在组件加载时发起数据请求
      axios.get(`https://api.moegoat.com/api/user/library/tag/id?tag_id=41&sort=choicest&page=${pageNumber}`)
      .then((res) => {
        const newData = res.data.data;
        if (newData.length === 0) {
          setHasMore(false);
        } else {
          mergeData(data, newData);
        }
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        setLoading(false)
      })
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
  
      if (scrollTop + windowHeight >= scrollHeight - 100 && !loading && hasMore) {
        if (!loading && hasMore) {
          setLoading(true)
          const page = pageNumber + 1
          setPageNumber(page);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading, pageNumber]);

  // 响应式展示图片
  return (
    <div className="App">
      <Flex wrap="wrap" gap="small">
        {Array.from(data, (item: any, i) => (
          <Card key={item['id'] + i.toString()}
            hoverable
            // style={{ width: 240 }}
            cover={<img alt="example" src={item['cover']} />}>
            <Meta title={item['loi_title']} description={
              <Space wrap>
                {Array.from(item['tags'], (tag: any, j) => (
                  <Tag key={item['id'] + tag['id'] + i + j} color={tag['color']}>{tag['name']}</Tag>
                ))}
              </Space>
            } />

          </Card>
        ))}
      </Flex>
      {/* <Button type="primary" onClick={() => nextPage()}>Next</Button> */}
      {loading && <p>加载中...</p>}
      {/* {!loading && hasMore && <p>Scroll down to load more</p>} */}
      {/* {!hasMore && <p>No more data</p>} */}
    </div>

  )
}

export default App;