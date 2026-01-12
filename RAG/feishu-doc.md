大模型RAG技术从小白到深入理解
image.png

1、RAG的整体架构设计
在深入细节之前，我们先来看看RAG的全貌。我画了一张完整的架构图，咱们一起来拆解：
image.png

1.1 架构图说明

这张图展示了RAG系统的完整流程，从左到右分为四个核心阶段：
数据准备阶段（左侧蓝色区域）：把你的文档、数据库等各种知识源准备好
索引构建阶段（浅蓝色区域）：把这些知识"消化"成机器能快速查找的格式
检索阶段（橙色区域）：用户问问题时，快速找到相关的知识
生成阶段（绿色区域）：结合找到的知识和问题，生成靠谱的答案
这就像你在图书馆找资料写论文：
数据准备 = 图书馆的藏书
索引构建 = 图书分类和目录卡
检索 = 你根据关键词找书
生成 = 你看着书写论文

一、概览
Overview（RAG是什么？）
RAG全称是Retrieval-Augmented Generation，中文叫"检索增强生成"。听起来有点学术，咱们用大白话解释：
传统LLM的问题： 想象你养了一只鹦鹉（LLM），它很聪明，能流利地说话。但问题是，它只会说训练时学到的话，而且：
如果你问它昨天的新闻，它不知道（知识过时）
如果你问它你公司的内部规定，它也不知道（没见过的知识）
有时候它还会"胡编乱造"，一本正经地瞎说（幻觉问题）
RAG的解决方案： 给这只鹦鹉配一个助手，助手手里拿着一堆资料。每次你提问时：
助手先翻资料，找到相关内容
把资料递给鹦鹉
鹦鹉看着资料回答问题
这样，鹦鹉的回答就有理有据了！
RAG技术通过将检索机制与生成模型结合，使LLM能够从外部知识源获取相关文档并基于这些文档生成答案，从而解决了传统LLM的知识过时、缺乏领域知识和幻觉等问题。
RAG的核心优势：

举个实际例子：

假设你在做一个医疗问答系统：
用户问："阿司匹林的常见副作用是什么？"

传统LLM可能回答：
"阿司匹林可能导致胃部不适、恶心等。(但不确定是否完整或最新)"

RAG系统的工作流程：
检索系统在医学数据库中搜索"阿司匹林 副作用"
找到3篇相关医学文献
提取关键信息：胃肠道反应、出血风险、过敏反应等
LLM基于这些文献生成答案：
"根据医学文献，阿司匹林的常见副作用包括：
胃肠道反应（胃痛、恶心、消化不良）
出血风险增加
过敏反应（如荨麻疹）
参考来源：[文献1]、[文献2]"
看到区别了吗？RAG不仅更准确，还能告诉你信息来源！



Indexing（索引构建：把知识装进"大脑"）
索引构建是RAG的"预处理"阶段，就像你上学前要先整理笔记、做好书签一样。这个阶段要把原始文档转化成机器能快速检索的格式。
image.png

2.1 数据获取（Data Ingestion）
第一步是收集数据，可能来自：
📄 PDF、Word、Markdown等文档
🌐 网页、Wiki
💾 数据库
📧 邮件、聊天记录
📊 Excel、CSV等结构化数据
实际案例： 某电商公司想做客服机器人，他们需要收集：
产品说明文档（PDF）
常见问题FAQ（网页）
历史工单数据（数据库）
退换货政策（Word文档）
2.2 文档预处理（Preprocessing）
拿到原始数据后，需要"清洗"一下：

#示例：文档预处理代码
def preprocess_document(doc):
    # 1. 移除多余的空格和换行
    doc = re.sub(r'\s+', ' ', doc)
    # 2. 提取纯文本（从PDF、HTML等）
    if doc_type == 'pdf':
        text = extract_text_from_pdf(doc)
    # 3. 规范化格式
    text = text.strip().lower()
    # 4. 去除无用信息（页眉、页脚等）
    text = remove_headers_footers(text)
    return text
2.3 文档分块（Chunking）
这是最关键的一步！为什么要分块？
想象一下： 你有一本500页的《红楼梦》，如果有人问"林黛玉是谁"，你不可能把整本书都递给他看吧？你会翻到介绍林黛玉的那几页。
分块就是这个道理：把大文档切成小段，每段包含一个相对完整的语义单元。
常见的分块策略：
固定大小分块（最简单，但可能切断语义）

#每300个字符一块
chunk_size = 300
chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
句子分块（按自然语言边界）

#按句号、问号、感叹号分割
import nltk
sentences = nltk.sent_tokenize(text)
段落分块（保留逻辑结构）
#按换行符或段落标记分割
chunks = text.split('\n\n')
滑动窗口分块（带重叠，避免信息丢失）

chunk_size = 300
overlap = 50  # 重叠50字符
chunks = []
for i in range(0, len(text), chunk_size - overlap):
    chunks.append(text[i:i+chunk_size])
分块的关键参数：
块大小（Chunk Size）
：太小 → 语义不完整；太大 → 检索不精准 
推荐：200-500 tokens（约150-400个汉字）
重叠（Overlap）
：避免关键信息被切断 
推荐：10-20% 的块大小
举个例子：

原文：
阿司匹林是一种常用的解热镇痛药。它的主要作用包括：
解热：降低发烧体温
镇痛：缓解轻到中度疼痛
抗血小板：预防血栓形成

但是，阿司匹林也有副作用。常见的副作用包括：
胃肠道反应：胃痛、恶心
出血风险：特别是长期服用
分块后：

Chunk 1: "阿司匹林是一种常用的解热镇痛药。它的主要作用包括：
         1. 解热：降低发烧体温
         2. 镇痛：缓解轻到中度疼痛
         3. 抗血小板：预防血栓形成"

Chunk 2: "阿司匹林的主要作用包括预防血栓形成。但是，阿司匹林也有副作用。
         常见的副作用包括：
         1. 胃肠道反应：胃痛、恶心
         2. 出血风险：特别是长期服用"
注意Chunk 2有重叠，这样即使用户搜"副作用"，也能同时看到"作用"相关的上下文。
2.4 向量化（Embedding）
分块后的文本还是人类语言，机器不懂。我们需要把它转换成向量（一串数字）。
什么是Embedding？
把文字转换成数字向量，相似的文字会得到相似的向量。

#使用OpenAI的Embedding模型
from openai import OpenAI
client = OpenAI()

text = "阿司匹林是一种解热镇痛药"
response = client.embeddings.create(
    model="text-embedding-3-small",
    input=text
)
vector = response.data[0].embedding
print(f"向量维度: {len(vector)}")  # 输出: 1536
print(f"前5个值: {vector[:5]}")    # 输出: [0.023, -0.014, 0.089, ...]
为什么需要向量化？
想象你在找"感冒药"，但文档里写的是"抗感冒药物"、"治疗感冒的药品"等各种说法。如果只靠关键词匹配，就找不到了。
但是！如果用向量化：
"感冒药" → [0.1, 0.3, 0.5, ...]
"抗感冒药物" → [0.12, 0.29, 0.51, ...]  # 向量很接近！
"汽车" → [0.8, 0.1, 0.2, ...]  # 向量差很远
向量之间可以计算相似度（余弦相似度），数值越接近1越相似：
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

vec1 = np.array([0.1, 0.3, 0.5])
vec2 = np.array([0.12, 0.29, 0.51])
similarity = cosine_similarity([vec1], [vec2])[0][0]
print(f"相似度: {similarity:.3f}")  # 输出: 0.999（非常相似）


常用的Embedding模型：

2.5 存储到向量数据库
最后，把这些向量存起来，用专门的向量数据库（Vector Database）。
为什么不用普通数据库？
普通数据库（MySQL、MongoDB）擅长精确查询："找ID=123的记录"。但向量搜索是相似性查询："找和[0.1, 0.3, 0.5]最相似的10个向量"。
向量数据库用了特殊的索引算法（如HNSW、IVF），能在百万、千万级向量中毫秒级找到最相似的。
常用向量数据库：
Pinecone（云服务，简单好用）

import pinecone

pinecone.init(api_key="your-api-key")
index = pinecone.Index("my-rag-index")

#插入向量
index.upsert([
    ("doc1_chunk1", vector1, {"text": "阿司匹林是..."}),
    ("doc1_chunk2", vector2, {"text": "副作用包括..."})
])

#查询
results = index.query(query_vector, top_k=3)
Milvus（开源，功能强大）
FAISS（Facebook开源，本地使用）
Weaviate（支持混合搜索）
完整的索引构建代码示例：
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import pinecone

#1. 读取文档
with open("medical_docs.txt", "r") as f:
    document = f.read()

#2. 分块
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", "！", "？", "，"]
)
chunks = text_splitter.split_text(document)

#3. 初始化embedding模型
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

#4. 初始化向量数据库
pinecone.init(api_key="your-key")
index_name = "medical-rag"

#5. 创建索引并存储
vectorstore = Pinecone.from_texts(
    texts=chunks,
    embedding=embeddings,
    index_name=index_name
)

print(f"成功索引了 {len(chunks)} 个文本块！")
运行这段代码，你的知识库就建好了！就像给图书馆做好了电子目录。

Retrieval（检索：快速找到相关知识）
索引建好后，用户来提问了。检索阶段的任务是：从海量知识中快速找出最相关的那几条。
image.png

3.1 查询处理
用户输入的问题往往不是完美的搜索词。比如：

用户原始问题："我吃了阿司匹林后胃疼怎么办？"

需要优化为：
"阿司匹林 胃痛 副作用"（关键词提取）
"阿司匹林导致的胃部不适如何处理"（问题改写）
3.2 向量检索
把用户问题也转换成向量，然后在向量数据库中搜索：

#用户问题
question = "阿司匹林有哪些副作用？"

#问题向量化
question_embedding = embeddings.embed_query(question)

#向量检索（找最相似的3个）
results = vectorstore.similarity_search_by_vector(
    embedding=question_embedding,
    k=3  # 返回top3
)

for i, doc in enumerate(results):
    print(f"结果{i+1}:")
    print(doc.page_content)
    print(f"相似度: {doc.metadata['score']}")
    print("-" * 50)
输出示例：

结果1:
阿司匹林的常见副作用包括：1. 胃肠道反应：胃痛、恶心、消化不良...
相似度: 0.89
结果2:
长期服用阿司匹林可能增加出血风险，特别是胃肠道出血...
相似度: 0.85
结果3:
少数患者对阿司匹林过敏，可能出现荨麻疹、呼吸困难等症状...
相似度: 0.81


3.3 检索策略
检索系统通常采用混合搜索方法，结合向量搜索（找语义相似的文档）和关键词搜索（精确匹配），然后对结果进行排序和过滤。
单纯向量搜索
优点：能理解语义
缺点：对专有名词、数字等不敏感
混合搜索（Hybrid Search）
向量搜索 + 关键词搜索
综合排序，取最优结果

#混合搜索示例
def hybrid_search(query, alpha=0.5):
    # alpha: 向量搜索权重（0-1）
    # 向量搜索结果
    vector_results = vectorstore.similarity_search(query, k=10)
    # 关键词搜索结果（BM25算法）
    keyword_results = bm25_search(query, k=10)
    # 融合排序
    final_results = merge_results(vector_results, keyword_results, alpha)
    return final_results[:3]  # 返回top3
重排序（Re-ranking）
初步检索后，用更精细的模型重新排序，提高精度。
from sentence_transformers import CrossEncoder

#加载重排序模型
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

#对检索结果重新打分
query = "阿司匹林副作用"
candidate_docs = ["文档1内容", "文档2内容", "文档3内容"]

scores = reranker.predict([(query, doc) for doc in candidate_docs])

#按分数排序
ranked_docs = [doc for _, doc in sorted(zip(scores, candidate_docs), reverse=True)]
3.4 检索效果评估指标
怎么知道检索效果好不好？