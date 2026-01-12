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



Generation（生成：基于知识产生答案）
检索到相关文档后，最后一步就是生成答案！
image.png

4.1 提示词构建（Prompt Engineering）
把检索到的文档和用户问题组合成一个完整的提示词（Prompt），发给LLM。
基础模板：

prompt_template = """
你是一个专业的医疗助手。请基于以下参考资料回答用户的问题。
如果参考资料中没有相关信息，请明确告知用户。

参考资料：
{context}

用户问题：
{question}

请提供详细、准确的回答，并标注信息来源。
"""

#填充内容
context = "\n\n".join([doc.page_content for doc in retrieved_docs])
question = "阿司匹林有哪些副作用？"

prompt = prompt_template.format(context=context, question=question)
进阶模板（结构化输出）：

advanced_prompt = """
参考资料：
{context}

用户问题：{question}

请按以下格式回答：
直接回答：用1-2句话概括答案
详细说明：展开解释，分点列出
注意事项：相关的警告或建议
信息来源：标注参考了哪些资料

回答：
"""
4.2 调用LLM生成

from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一个专业的医疗助手"},
        {"role": "user", "content": prompt}
    ],
    temperature=0.3,  # 降低随机性，提高准确性
    max_tokens=500
)

answer = response.choices[0].message.content
print(answer)
4.3 答案后处理
生成答案后，可能还需要：
引用标注：给答案加上来源链接

def add_citations(answer, sources):
    """给答案添加引用"""
    for i, source in enumerate(sources):
        answer += f"\n[{i+1}] {source['title']} - {source['url']}"
    return answer
安全过滤：检查答案是否包含有害内容

def safety_check(answer):
    harmful_keywords = ["自杀", "违法", "..."]
    for keyword in harmful_keywords:
        if keyword in answer:
            return "抱歉，这个问题涉及敏感内容，建议咨询专业人士。"
    return answer
格式美化：Markdown格式化、表格化等
4.4 完整的RAG生成代码

def rag_query(question):
    """完整的RAG查询流程"""
    # 1. 检索相关文档
    retrieved_docs = vectorstore.similarity_search(question, k=3)
    # 2. 构建prompt
    context = "\n\n".join([
        f"【文档{i+1}】{doc.page_content}"
        for i, doc in enumerate(retrieved_docs)
    ])
    prompt = f"""
    参考以下资料回答问题：
    {context}
    问题：{question}
    要求：
    1. 回答要准确、专业
    2. 必须基于参考资料
    3. 标注信息来源
    """
    # 3. 调用LLM生成
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    answer = response.choices[0].message.content
    # 4. 添加引用
    sources = [
        {"title": f"文档{i+1}", "score": doc.metadata.get('score', 0)}
        for i, doc in enumerate(retrieved_docs)
    ]
    return {
        "answer": answer,
        "sources": sources,
        "retrieved_docs": [doc.page_content for doc in retrieved_docs]
    }

#使用示例
result = rag_query("阿司匹林有哪些副作用？")
print("答案:", result['answer'])
print("\n参考来源:", result['sources'])
4.5 生成效果评估
RAG系统的生成质量评估需要考虑准确性、相关性和忠实度等多个维度，确保模型生成的答案既准确又能体现检索到的上下文信息。



最近在做大模型项目的时候，发现很多同学对RAG的理解还停留在"检索+生成"这个表面概念上。但实际上，RAG是一个超级复杂的系统工程，涉及到的优化点多达几十个。
就像你开了一家餐厅，不是说有食材（数据）和厨师（大模型）就够了，你还得考虑：
食材怎么切（Chunking）？
调料怎么配（Embedding）？
菜单怎么设计（Query优化）？
上菜顺序怎么安排（Re-ranking）？
顾客满意度怎么评估（效果评估）？



二、RAG查询优化策略
前言
先说个真实场景：用户问"阿司匹林怎么吃？"
你的RAG系统可能只检索到"阿司匹林 用法"相关的文档，但其实用户真正想问的可能是：
阿司匹林的剂量是多少？
什么时间吃效果最好？
有什么禁忌和副作用？
哪些人群不适合吃？
看到了吧？一个简单的问题背后，其实藏着好几个子问题。如果你只用原始问题去检索，很可能漏掉关键信息。
这就是为什么要优化提问！ 通过对用户问题进行改写、扩展、分解，我们可以：
✅ 提高检索的召回率（找到更多相关内容）
✅ 覆盖问题的多个维度
✅ 减少歧义和理解偏差

Multi Query - 多查询策略
核心思想
一个问题，多种问法。
就像你去问路，同一个目的地，可以这样问：
"天安门怎么走？"
"去天安门广场的路线？"
"从这里到天安门的交通方式？"
虽然表达不同，但目的一样。Multi Query就是让大模型生成多个语义相似但表达不同的查询，然后用这些查询去检索，最后合并结果。
工作流程
输入原始问题：用户问"Python如何处理JSON数据？"
LLM生成多个查询：
Query 1: "Python解析JSON的方法"
Query 2: "如何在Python中读取JSON文件"
Query 3: "Python JSON模块使用教程"
Query 4: "Python处理JSON格式数据的最佳实践"
并行检索：用这4个查询同时去向量数据库检索
结果合并：把4次检索的结果去重、排序，得到最终结果
优势分析

实际案例

#伪代码示例
original_query = "如何提高代码执行效率？"

#LLM生成多个查询
multi_queries = llm.generate_queries(original_query, num_queries=4)
#输出：
#[\"代码性能优化技巧\",
#\"提升程序运行速度的方法\",
#\"如何让代码跑得更快\",
#\"代码执行效率优化最佳实践\"]

#并行检索
all_results = []
for query in multi_queries:
    results = vector_db.search(query, top_k=5)
    all_results.extend(results)

#去重合并
final_results = deduplicate_and_rank(all_results)
注意事项
⚠️ 不是查询越多越好！ 一般3-5个查询就够了，太多会：
增加API调用成本
增加检索时间
可能引入噪声
架构图
image.png

从图中可以清晰看到：
原始问题经过LLM改写生成4个不同表达的查询
每个查询独立进行向量检索，获取Top-5结果
最后将4组结果合并、去重、重新排序

RAG-Fusion - 多查询结果融合策略
核心思想
RAG-Fusion是Multi Query的进化版，不仅生成多个查询，还使用了倒数排序融合（Reciprocal Rank Fusion, RRF）算法来合并结果。
简单说：不是简单粗暴地把结果堆一起，而是科学地给每个结果打分，让真正重要的文档排在前面。
什么是RRF？
举个例子，假设你问3个朋友推荐餐厅：
朋友A的推荐排序：
海底捞
外婆家
西贝
朋友B的推荐排序：
外婆家
海底捞
必胜客
朋友C的推荐排序：
西贝
外婆家
肯德基
如果用简单投票，海底捞2票，外婆家3票，西贝2票... 但这样有问题：外婆家虽然被提到3次，但在A那里是第2名，不是第1名。
RRF算法会这样算：
对于每个餐厅，计算它在各个列表中的倒数排名分数：

其中：
 是文档（餐厅）
 是所有查询结果列表
 是文档在列表r中的排名
 是常数（通常取60）
计算海底捞的分数：
在A的列表：排名1 →
在B的列表：排名2 →
在C的列表：没出现 →
总分：0.0325
计算外婆家的分数：
在A的列表：排名2 →
在B的列表：排名1 →
在C的列表：排名2 →
总分：0.0486
计算西贝的分数：
在A的列表：排名3 →
在B的列表：没出现 →
在C的列表：排名1 →
总分：0.0323
最终排序：外婆家(0.0486) > 海底捞(0.0325) > 西贝(0.0323)
看到了吧？外婆家虽然没拿过第1名，但因为出现频率高且排名都靠前，所以综合得分最高！
RAG-Fusion工作流程
生成多个查询（和Multi Query一样）
并行检索（和Multi Query一样）
使用RRF算法融合结果（这是关键！）
返回重新排序后的Top-K文档
image.png

代码示例

def reciprocal_rank_fusion(search_results_dict, k=60):
    """
    使用倒数排序融合算法合并多个搜索结果
    Args:
        search_results_dict: {query: [(doc_id, score), ...]}
        k: RRF常数，默认60
    Returns:
        融合后的排序结果
    """
    fused_scores = {}
    for query, doc_scores in search_results_dict.items():
        for rank, (doc_id, score) in enumerate(doc_scores, start=1):
            if doc_id not in fused_scores:
                fused_scores[doc_id] = 0
            # RRF公式
            fused_scores[doc_id] += 1 / (k + rank)
    # 按融合分数降序排序
    reranked_results = sorted(
        fused_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )
    return reranked_results

#使用示例
search_results = {
    "query1": [("doc1", 0.95), ("doc2", 0.88), ("doc3", 0.82)],
    "query2": [("doc2", 0.92), ("doc1", 0.87), ("doc4", 0.80)],
    "query3": [("doc3", 0.90), ("doc2", 0.85), ("doc1", 0.78)]
}

final_ranking = reciprocal_rank_fusion(search_results)
print(final_ranking)
#输出：[('doc2', 0.0486), ('doc1', 0.0479), ('doc3', 0.0320), ('doc4', 0.0161)]
为什么RRF这么有效？

实际效果对比
假设我们要回答："Python异步编程的优势是什么？"
普通Multi Query（简单合并）：
结果包含很多重复文档
排序不一定科学
Top-5可能都来自同一个查询
RAG-Fusion（RRF融合）：
去重且智能排序
综合考虑所有查询的反馈
Top-5结果更多样化、更全面
注意事项
✅ 适用场景：
用户问题比较复杂，需要多角度检索
对召回率要求高的场景
希望结果多样性的场景
❌ 不适用场景：
简单的事实查询（浪费资源）
实时性要求极高的场景（会增加延迟）
资源受限的环境（多次LLM调用 + 多次检索）
架构图
image.png

从图中可以看到：
左半部分是标准的Multi Query流程
右半部分展示了RRF算法如何计算每个文档的融合分数
底部对比表清晰说明了RRF相比简单合并的优势

Decomposition - 问题分解策略
核心思想
把一个复杂问题拆解成多个简单的子问题，逐个击破！
就像你要做一道菜"红烧肉"，你不会一步到位，而是：
先准备食材（买肉、调料）
处理食材（切块、焯水）
烹饪步骤（煎、炖、收汁）
摆盘装饰
每一步都简单明确，组合起来就是一道完美的菜。
为什么需要问题分解？
很多用户的问题其实是复合型问题，包含多个信息需求。
举个例子：
用户问："我想知道北京和上海的房价对比，以及各自的购房政策和未来发展趋势。"
这个问题其实包含了：
北京的房价水平
上海的房价水平
北京的购房政策
上海的购房政策
北京的未来发展趋势
上海的未来发展趋势
如果你直接用原始问题去检索，可能会：
❌ 检索结果太泛，不精准
❌ 有些子问题的答案被遗漏
❌ 大模型在综合回答时逻辑混乱
使用问题分解后：
✅ 每个子问题独立检索，精准度更高
✅ 覆盖全面，不会遗漏信息
✅ 最后综合所有子答案，回答更有条理
工作流程

原始问题
    ↓
LLM分解为子问题
    ↓
并行检索每个子问题
    ↓
获得每个子问题的答案
    ↓
LLM综合所有子答案，生成最终回答
实际案例
原始问题： "如何搭建一个高性能的RAG系统？需要考虑哪些技术选型和优化策略？"
LLM分解后：

子问题列表 = [
    "1. RAG系统的核心组件有哪些？",
    "2. 如何选择合适的向量数据库？",
    "3. Embedding模型如何选型？",
    "4. 文档分块(Chunking)的最佳实践是什么？",
    "5. 如何优化检索性能？",
    "6. 生成阶段有哪些优化技巧？"
]
针对每个子问题进行检索和回答：

最终综合答案： "搭建高性能RAG系统需要从以下几个方面考虑：首先，系统包含数据处理、向量化、存储、检索、生成5大核心模块。在技术选型上，小规模项目可以用FAISS作为向量数据库，中大规模建议Milvus或Pinecone；Embedding模型中文场景推荐BGE-large-zh。在优化策略上，Chunking建议采用语义分块并设置50-100 token重叠；检索阶段可以引入Re-ranking提升精度；生成阶段要设计明确的Prompt模板并适当调节温度参数..."
看到了吧？通过分解，我们得到了一个结构清晰、内容全面的答案！
代码实现
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

#步骤1: 问题分解
decompose_prompt = PromptTemplate(
    template="""
    请将以下复杂问题分解为3-6个简单的子问题。
    每个子问题应该独立且可以单独回答。
    原始问题: {question}
    请以JSON列表格式输出子问题:
    ["子问题1", "子问题2", "子问题3", ...]
    """,
    input_variables=["question"]
)

llm = OpenAI(temperature=0.7)

original_question = "如何搭建一个高性能的RAG系统？需要考虑哪些技术选型和优化策略？"

#分解问题
sub_questions = llm(decompose_prompt.format(question=original_question))
sub_questions = json.loads(sub_questions)

#步骤2: 对每个子问题进行RAG检索和回答
sub_answers = []
for sub_q in sub_questions:
    # 检索相关文档
    relevant_docs = vector_db.search(sub_q, top_k=3)
    # 生成子答案
    answer_prompt = f"""
    基于以下文档，回答问题: {sub_q}
    文档内容:
    {relevant_docs}
    请简洁明确地回答:
    """
    sub_answer = llm(answer_prompt)
    sub_answers.append({
        "question": sub_q,
        "answer": sub_answer
    })

#步骤3: 综合所有子答案
synthesis_prompt = f"""
你是一个专业的技术专家。现在你需要基于以下子问题和对应的答案，
综合生成一个完整、有条理的回答。

原始问题: {original_question}

子问题和答案:
{json.dumps(sub_answers, ensure_ascii=False, indent=2)}

请生成一个结构清晰、逻辑连贯的最终答案:
"""

final_answer = llm(synthesis_prompt)
print(final_answer)
三种常见的分解策略
顺序分解（Sequential Decomposition）
适用场景： 问题之间有先后依赖关系
例子： "如何训练一个GPT模型并部署到生产环境？"
分解为：
准备训练数据 →
选择模型架构 →
训练模型 →
模型评估 →
模型优化 →
部署上线
每一步的答案会作为下一步的输入或参考。
并行分解（Parallel Decomposition）
适用场景： 子问题之间相互独立
例子： "比较PyTorch和TensorFlow的优缺点"
分解为：
PyTorch的优点
PyTorch的缺点
TensorFlow的优点
TensorFlow的缺点
这些子问题可以同时检索，提高效率。
层次分解（Hierarchical Decomposition）
适用场景： 问题有多个层级
例子： "如何设计一个电商推荐系统？"
第一层分解：
数据层
算法层
工程层
第二层分解：
数据层 → 数据采集、数据清洗、特征工程
算法层 → 召回算法、排序算法、实时更新
工程层 → 系统架构、性能优化、监控告警
优势分析

注意事项
⚠️ 不是所有问题都需要分解！
适合分解的问题：
包含多个独立信息需求
需要对比分析
需要多步骤解答
问题比较复杂抽象
不适合分解的问题：
简单的事实查询（"Python之父是谁？"）
单一明确的问题（"2+2等于几？"）
定义类问题（"什么是RAG？"）
💡 分解的粒度要适中：
太粗：失去分解的意义
太细：增加系统复杂度和延迟

Step Back问答回退策略
什么是Step Back？
想象一下，你在图书馆找书，直接冲过去问管理员："2023年10月发布的那个新的React框架叫什么？"管理员一脸懵逼。但如果你先退一步问："最近有哪些新的React框架？"然后再缩小范围，是不是容易多了？
Step Back Prompting就是这个道理——不直接回答具体问题，而是先生成一个更抽象、更通用的"回退问题"，从更高层次理解用户意图，然后再回答原问题。
工作原理
image.png

整个流程分三步走：
步骤1：抽象化（Abstraction）

原问题：特斯拉Model 3在2023年Q4的销量是多少？
↓ Step Back
回退问题：特斯拉Model 3历年的销量趋势是怎样的？
步骤2：检索（Retrieval） 用回退问题去检索，能获取更广泛、更有上下文的信息。
步骤3：推理（Reasoning） 结合回退问题的答案和原问题，生成更准确的回答。
代码实现

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

#Step 1: 定义Step Back提示词模板
step_back_template = """你是一个世界知识专家。你的任务是把具体问题转化为更通用的回退问题。

示例：
原问题：特斯拉Model 3在2023年Q4的销量是多少？
回退问题：特斯拉Model 3历年的销量趋势和数据有哪些？

原问题：张三在2020-2022年担任什么职位？
回退问题：张三的职业生涯发展轨迹是怎样的？

现在请处理这个问题：
原问题：{original_question}
回退问题："""

llm = ChatOpenAI(model="gpt-4", temperature=0.3)
step_back_prompt = ChatPromptTemplate.from_template(step_back_template)

#Step 2: 生成回退问题
def generate_step_back_question(original_q):
    chain = step_back_prompt | llm
    response = chain.invoke({"original_question": original_q})
    return response.content

#Step 3: 使用回退问题进行RAG检索
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

def step_back_rag(original_question, vectorstore):
    # 生成回退问题
    step_back_q = generate_step_back_question(original_question)
    print(f"📝 回退问题: {step_back_q}")
    # 用回退问题检索
    docs = vectorstore.similarity_search(step_back_q, k=5)
    context = "\n\n".join([doc.page_content for doc in docs])
    # 最终回答
    final_prompt = f"""基于以下上下文信息，回答问题。

上下文：
{context}

回退问题：{step_back_q}
原问题：{original_question}

请给出准确、详细的回答："""
    response = llm.invoke(final_prompt)
    return response.content

#使用示例
question = "DeepSeek在2024年1月发布的模型性能如何？"
answer = step_back_rag(question, my_vectorstore)
print(f"✅ 答案: {answer}")
实际效果对比

适用场景
✅ 非常适合：
需要多步推理的复杂问题
时间序列相关查询（"最近"、"历年"、"趋势"）
需要理解高层概念的问题
❌ 不太适合：
简单的事实查询（"北京是中国的首都吗？"）
需要实时数据的场景
计算密集型任务

HyDE（假设性文档嵌入）
核心思想
HyDE的脑洞真的很大！它不是直接拿用户问题去搜索，而是：
让LLM先"编"一个假的答案（可能包含错误，但没关系）
把这个假答案转成向量
用假答案的向量去搜索真实文档
为啥这样能work？因为答案和答案之间的相似度，远高于问题和答案之间的相似度！
工作流程图
image.png

问题的本质
传统RAG有个致命缺陷：查询-文档不对称

用户问题：Milvus是什么？ [向量维度: 1536]
         ↓ 余弦相似度 ↓
文档内容：Milvus是一个开源向量数据库，用于大规模向量存储和检索，
         支持十亿级向量的毫秒级检索... [向量维度: 1536]
看起来很美好？NO！问题在于：
问题通常很短（3-10个词）
文档内容很长（几百个词）
语义空间分布差异巨大
就像你拿着一张小纸条去图书馆找整本书，匹配度天然就低。
HyDE如何解决？
from langchain.llms import OpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import HypotheticalDocumentEmbedder
from langchain.vectorstores import FAISS

#Step 1: 初始化组件
llm = OpenAI(temperature=0.7)
base_embeddings = OpenAIEmbeddings()

#Step 2: 创建HyDE嵌入器
hyde_prompt_template = """请写一段文本来回答以下问题。
即使不确定，也请尽可能详细地生成一个假设性的答案。

问题：{question}
假设性文档："""

hyde_embeddings = HypotheticalDocumentEmbedder.from_llm(
    llm=llm,
    base_embeddings=base_embeddings,
    prompt_key="web_search"  # 使用预定义模板
)

#Step 3: 构建向量库（使用HyDE嵌入）
documents = [
    "Milvus是一个云端向量数据库，用于大规模向量存储和检索。",
    "COVID-19疫情显著影响了心理健康，增加了抑郁和焦虑。",
    "人类使用火已有大约80万年的历史。"
]

vectorstore = FAISS.from_texts(documents, hyde_embeddings)

#Step 4: 查询（HyDE会自动生成假设文档）
query = "什么是Milvus？"
results = vectorstore.similarity_search(query, k=3)

for i, doc in enumerate(results):
    print(f"结果{i+1}: {doc.page_content}")
完整的HyDE实现（从零开始）
import openai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class HyDERetriever:
    def __init__(self, llm_model="gpt-3.5-turbo", embedding_model="text-embedding-3-small"):
        self.llm_model = llm_model
        self.embedding_model = embedding_model
        self.doc_embeddings = []
        self.documents = []

    def generate_hypothetical_document(self, query, num_docs=3):
        """生成多个假设性文档"""
        prompt = f"""根据问题生成一个详细的假设性回答。
        即使不确定，也要写得像真实文档一样。
        问题：{query}
        假设性回答："""
        hypothetical_docs = []
        for _ in range(num_docs):
            response = openai.ChatCompletion.create(
                model=self.llm_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,  # 增加随机性获取多样性
                max_tokens=300
            )
            hypothetical_docs.append(response.choices[0].message.content)
        return hypothetical_docs

    def get_embedding(self, text):
        """获取文本嵌入"""
        response = openai.Embedding.create(
            model=self.embedding_model,
            input=text
        )
        return np.array(response['data'][0]['embedding'])

    def add_documents(self, documents):
        """添加文档到知识库"""
        self.documents = documents
        self.doc_embeddings = [self.get_embedding(doc) for doc in documents]

    def retrieve(self, query, top_k=5):
        """使用HyDE检索"""
        # 1. 生成假设性文档
        hypo_docs = self.generate_hypothetical_document(query, num_docs=3)
        print(f"🎭 生成的假设文档：\n{hypo_docs[0][:200]}...\n")
        # 2. 对假设文档做嵌入并平均
        hypo_embeddings = [self.get_embedding(doc) for doc in hypo_docs]
        avg_hypo_embedding = np.mean(hypo_embeddings, axis=0)
        # 3. 计算与真实文档的相似度
        similarities = [
            cosine_similarity([avg_hypo_embedding], [doc_emb])[0][0]
            for doc_emb in self.doc_embeddings
        ]
        # 4. 返回Top-K结果
        top_indices = np.argsort(similarities)[::-1][:top_k]
        results = [(self.documents[i], similarities[i]) for i in top_indices]
        return results, hypo_docs[0]

#使用示例
retriever = HyDERetriever()

#添加文档
knowledge_base = [
    "RAG（检索增强生成）是一种结合信息检索和生成模型的技术，通过从外部知识库检索相关信息来增强LLM的回答能力。",
    "向量数据库如Milvus、Pinecone专门用于存储和快速检索高维向量数据，是RAG系统的核心组件。",
    "Embedding模型将文本转换为高维向量表示，常用的有OpenAI的text-embedding-3、BGE、sentence-transformers等。"
]

retriever.add_documents(knowledge_base)

#检索
query = "如何提高RAG系统的检索准确率？"
results, hypo_doc = retriever.retrieve(query, top_k=3)

print("\n🔍 检索结果：")
for i, (doc, score) in enumerate(results):
    print(f"\n结果{i+1} (相似度: {score:.4f}):")
    print(f"{doc}")
性能对比实验

#对比测试：传统RAG vs HyDE
def compare_rag_vs_hyde(query, vectorstore):
    # 传统方法
    traditional_results = vectorstore.similarity_search(query, k=5)
    # HyDE方法
    hyde_results, _ = hyde_retriever.retrieve(query, top_k=5)
    return {
        "传统RAG": traditional_results,
        "HyDE": hyde_results
    }

#测试用例
test_queries = [
    "机器学习中的过拟合如何解决？",
    "Python中的装饰器是什么原理？",
    "微服务架构的优缺点有哪些？"
]

for q in test_queries:
    results = compare_rag_vs_hyde(q, my_vectorstore)
    print(f"\n问题：{q}")
    print("=" * 50)
实际效果数据
在BEIR基准测试上的表现：

优缺点分析
✅ 优势：
零样本性能强：不需要标注数据
语义对齐好：答案-答案匹配比问题-答案匹配更准
跨域泛化：在不同领域都表现不错
⚠️ 局限：
依赖LLM知识：如果LLM对该领域一无所知，生成的假设文档就是垃圾
计算成本高：需要额外调用LLM生成假设文档（通常生成3-5个）
时延增加：增加了一个LLM调用环节，响应时间约+200-500ms
最佳实践建议
混合使用：对简单查询用传统检索，复杂查询才用HyDE

def smart_retrieve(query, vectorstore, threshold=10):
    # 简单查询直接检索
    if len(query.split()) < threshold:
        return vectorstore.similarity_search(query)
    # 复杂查询用HyDE
    else:
        return hyde_retriever.retrieve(query)
缓存假设文档：相似问题可以复用之前生成的假设文档
调整生成数量：通常3-5个假设文档效果最好，太多反而分散
领域适配：针对特定领域微调prompt模板



三、路由优化和问题构建策略
如何让系统智能地选择数据源（路由）和如何构建结构化查询（查询构建）。


想象一下，你的RAG系统需要处理多种类型的查询：
有些需要查向量数据库
有些需要查关系型数据库（SQL）
有些需要查图数据库（Cypher）
有些甚至需要去搜索网页
这时候，路由系统就像一个聪明的交通指挥员，把不同的问题送到最合适的地方去处理。

3.1 Routing（路由）：智能流量调度
什么是RAG路由？
路由（Routing）本质上是一个分类问题：给定用户查询，决定该用哪个数据源、用哪种检索策略、甚至用哪个LLM模型来处理。
image.png

路由的两种核心方式
逻辑路由（Logical Routing）
基于规则和查询结构分析来决定路由。
实现方式：使用LLM作为分类器

from typing import Literal
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

#定义路由选项
class RouteQuery(BaseModel):
    """将用户查询路由到最相关的数据源"""
    datasource: Literal["vectorstore", "sql_database", "web_search", "graph_database"] = Field(
        description="根据用户问题选择最合适的数据源"
    )
    reasoning: str = Field(
        description="选择该数据源的理由"
    )

#创建路由提示词
router_prompt = ChatPromptTemplate.from_template("""
你是一个专业的查询路由系统。根据用户问题的特点，选择最合适的数据源。

数据源说明：
vectorstore: 非结构化文档、技术文档、知识库文章
sql_database: 结构化数据、表格数据、统计查询、聚合运算
web_search: 实时信息、最新新闻、公开网络数据
graph_database: 复杂关系查询、知识图谱、实体关系分析

用户问题: {question}

请分析问题并选择合适的数据源。
""")

#构建路由链
llm = ChatOpenAI(model="gpt-4", temperature=0)
structured_llm = llm.with_structured_output(RouteQuery)
router_chain = router_prompt | structured_llm

#使用路由
def route_question(question: str):
    result = router_chain.invoke({"question": question})
    print(f"📍 路由决策: {result.datasource}")
    print(f"💭 理由: {result.reasoning}")
    return result.datasource

#测试案例
questions = [
    "2024年诺贝尔物理学奖获得者是谁？",  # → web_search
    "公司员工表中年龄超过35岁的人数统计",  # → sql_database
    "什么是强化学习？",  # → vectorstore
    "张三和李四之间有哪些合作关系？"  # → graph_database
]

for q in questions:
    print(f"\n问题: {q}")
    route = route_question(q)
    print("-" * 60)
运行结果：

问题: 2024年诺贝尔物理学奖获得者是谁？
📍 路由决策: web_search
💭 理由: 这是关于2024年的实时信息，需要从网络获取最新数据

问题: 公司员工表中年龄超过35岁的人数统计
📍 路由决策: sql_database
💭 理由: 这是结构化数据的统计查询，需要SQL聚合运算

问题: 什么是强化学习？
📍 路由决策: vectorstore
💭 理由: 这是技术概念查询，适合从知识库文档检索

问题: 张三和李四之间有哪些合作关系？
📍 路由决策: graph_database
💭 理由: 这涉及实体间的复杂关系查询，适合图数据库
语义路由（Semantic Routing）
基于查询的语义相似度来路由，更加灵活智能。

from sentence_transformers import SentenceTransformer
import numpy as np

class SemanticRouter:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        # 定义路由模板（每个数据源的典型查询示例）
        self.route_templates = {
            "product_info": [
                "产品价格是多少",
                "这个产品有什么功能",
                "产品规格参数",
                "产品库存情况"
            ],
            "technical_docs": [
                "如何配置系统",
                "技术实现原理",
                "API使用说明",
                "故障排查步骤"
            ],
            "customer_support": [
                "账号无法登录",
                "忘记密码怎么办",
                "申请退款流程",
                "投诉建议"
            ],
            "analytics": [
                "销售数据统计",
                "用户增长趋势",
                "月度报表分析",
                "业绩对比"
            ]
        }
        # 预计算模板嵌入
        self.route_embeddings = {}
        for route, templates in self.route_templates.items():
            embeddings = self.model.encode(templates)
            # 计算中心点
            self.route_embeddings[route] = np.mean(embeddings, axis=0)
    def route(self, query: str, threshold=0.5):
        """基于语义相似度路由查询"""
        query_embedding = self.model.encode([query])[0]
        # 计算与每个路由中心的相似度
        similarities = {}
        for route, center_embedding in self.route_embeddings.items():
            similarity = np.dot(query_embedding, center_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(center_embedding)
            )
            similarities[route] = similarity
        # 选择最相似的路由
        best_route = max(similarities, key=similarities.get)
        confidence = similarities[best_route]
        # 如果相似度太低，返回默认路由
        if confidence < threshold:
            return "general", confidence
        return best_route, confidence

#使用示例
router = SemanticRouter()

test_queries = [
    "iPhone 15 Pro价格多少钱？",
    "如何部署Kubernetes集群？",
    "我的账号被锁定了怎么办？",
    "上个月的销售额是多少？"
]

for query in test_queries:
    route, confidence = router.route(query)
    print(f"\n问题: {query}")
    print(f"🎯 路由到: {route} (置信度: {confidence:.2f})")
完整的路由系统架构

class AdvancedRAGRouter:
    def __init__(self):
        self.vectorstore = None  # 向量数据库连接
        self.sql_db = None       # SQL数据库连接
        self.graph_db = None     # 图数据库连接
        self.web_search = None   # 网络搜索接口
        self.llm = ChatOpenAI(model="gpt-4", temperature=0)
        self.semantic_router = SemanticRouter()
    def multi_route(self, query: str):
        """
        多路由策略：可能同时路由到多个数据源
        适用于需要综合多个数据源的复杂查询
        """
        # Step 1: LLM分析查询复杂度
        analysis_prompt = f"""分析以下查询的复杂度和所需数据源：
        查询: {query}
        返回JSON格式：
        {{
            "complexity": "simple/medium/complex",
            "required_sources": ["source1", "source2", ...],
            "reasoning": "分析理由"
        }}
        """
        analysis = self.llm.invoke(analysis_prompt)
        # Step 2: 并行查询多个数据源
        results = {}
        required_sources = analysis.get("required_sources", [])
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = {}
            for source in required_sources:
                if source == "vectorstore":
                    futures[source] = executor.submit(self._query_vectorstore, query)
                elif source == "sql_database":
                    futures[source] = executor.submit(self._query_sql, query)
                elif source == "web_search":
                    futures[source] = executor.submit(self._query_web, query)
            # 收集结果
            for source, future in futures.items():
                results[source] = future.result()
        # Step 3: 融合结果
        final_result = self._fuse_results(query, results)
        return final_result
    def _query_vectorstore(self, query):
        """查询向量数据库"""
        return self.vectorstore.similarity_search(query, k=5)
    def _query_sql(self, query):
        """查询SQL数据库"""
        # 使用LLM生成SQL（下一节详细讲）
        sql_query = self._text_to_sql(query)
        return self.sql_db.execute(sql_query)
    def _query_web(self, query):
        """网络搜索"""
        return self.web_search.search(query, num_results=5)
    def _fuse_results(self, query, results):
        """融合多数据源的结果"""
        context = ""
        for source, data in results.items():
            context += f"\n===来自 {source} 的信息===\n"
            context += str(data)
        # LLM综合生成答案
        final_prompt = f"""基于以下多个数据源的信息，回答用户问题：
        {context}
        用户问题: {query}
        请综合所有信息给出完整、准确的答案：
        """
        return self.llm.invoke(final_prompt)

#使用示例
router = AdvancedRAGRouter()
result = router.multi_route("比较我们公司2023年和2024年的销售数据，并分析市场趋势")
#这个查询会同时：
#1. 从SQL数据库获取销售数据
#2. 从向量库获取市场分析文档
#3. 从网络搜索获取最新市场资讯
路由决策树可视化
image.png

最佳实践建议
路由粒度控制
🎯 5-20个主题最合适
太少：路由不够精细
太多：主题重叠，维护困难
添加fallback机制

def safe_route(query, router):
    try:
        result = router.route(query)
        if result.confidence < 0.6:
            # 置信度太低，使用通用路由
            return "general_vectorstore"
        return result.datasource
    except Exception as e:
        logging.error(f"路由失败: {e}")
        return "fallback_human_agent"  # 转人工
A/B测试路由策略

#50%用户用新路由，50%用旧路由
if user_id % 2 == 0:
    result = new_router.route(query)
else:
    result = old_router.route(query)

#收集指标对比
metrics.log({
    "router_version": "new" if user_id % 2 == 0 else "old",
    "latency": response_time,
    "user_satisfaction": user_rating
})

3.2 Query Construction（查询构建）：说数据库的语言
核心挑战
用户说人话，数据库说"方言"：
关系数据库 → SQL
图数据库 → Cypher
向量库 + 元数据 → 结构化过滤
Query Construction的任务：把自然语言转换成数据库能理解的查询语言。
image.png

方法1: Text-to-SQL（自查询检索器）

#场景：向量库中存储了大量文档，每个文档都有结构化的元数据。
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo
from langchain_openai import OpenAI

#Step 1: 定义文档元数据结构
metadata_field_info = [
    AttributeInfo(
        name="author",
        description="文档作者的名字",
        type="string"
    ),
    AttributeInfo(
        name="publish_date",
        description="文档发布日期，格式: YYYY-MM-DD",
        type="string"
    ),
    AttributeInfo(
        name="category",
        description="文档类别",
        type="string or list[string]"
    ),
    AttributeInfo(
        name="rating",
        description="文档评分，1-5分",
        type="integer"
    )
]

#文档内容描述
document_content_description = "技术博客文章"

#Step 2: 创建自查询检索器
llm = OpenAI(temperature=0)
retriever = SelfQueryRetriever.from_llm(
    llm,
    vectorstore,
    document_content_description,
    metadata_field_info,
    verbose=True
)

#Step 3: 使用自然语言查询
query = "找出张三写的2024年发布的关于机器学习的文章"
docs = retriever.get_relevant_documents(query)

#内部会自动生成类似这样的过滤条件:
filter = {
"author": "张三",
"publish_date": {"$gte": "2024-01-01"},
"category": {"$in": ["机器学习"]}
}
完整的Text-to-SQL实现
from langchain.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain

#连接数据库
db = SQLDatabase.from_uri("sqlite:///company.db")

#创建SQL链
sql_chain = SQLDatabaseChain.from_llm(
    llm=ChatOpenAI(model="gpt-4", temperature=0),
    db=db,
    verbose=True,
    use_query_checker=True,  # 自动检查SQL语法
    return_intermediate_steps=True
)

#自然语言查询
questions = [
    "2024年销售额最高的前10个产品是什么？",
    "哪些员工的工资高于部门平均工资？",
    "每个城市的客户数量分布情况"
]

for question in questions:
    print(f"\n❓ 问题: {question}")
    result = sql_chain(question)
    print(f"🔍 生成的SQL:\n{result['intermediate_steps'][0]}")
    print(f"✅ 结果:\n{result['result']}")
实际运行示例：

❓ 问题: 2024年销售额最高的前10个产品是什么？

🔍 生成的SQL:
SELECT product_name, SUM(amount) as total_sales
FROM orders
WHERE YEAR(order_date) = 2024
GROUP BY product_name
ORDER BY total_sales DESC
LIMIT 10;

✅ 结果:
| 产品名称 | 总销售额 |
|---------|---------|
| iPhone 15 Pro | ¥12,850,000 |
| MacBook Pro M3 | ¥8,920,000 |
| ...
方法2: Text-to-Cypher（图数据库查询）
场景：知识图谱、关系网络、社交网络分析
from langchain.chains import GraphCypherQAChain
from langchain_community.graphs import Neo4jGraph

#连接Neo4j图数据库
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

#创建Cypher查询链
cypher_chain = GraphCypherQAChain.from_llm(
    llm=ChatOpenAI(model="gpt-4", temperature=0),
    graph=graph,
    verbose=True
)

#自然语言查询
questions = [
    "张三和李四之间有几度关系？",
    "找出所有和'人工智能'相关的技术节点",
    "计算每个人的影响力分数（基于关系数量）"
]

for question in questions:
    response = cypher_chain.run(question)
    print(f"\n问题: {question}")
    print(f"答案: {response}")
生成的Cypher示例：

// 问题: 张三和李四之间有几度关系？
MATCH path = shortestPath(
  (p1:Person {name: "张三"})-[*]-(p2:Person {name: "李四"})
)
RETURN length(path) as degrees, path

// 问题: 找出所有和'人工智能'相关的技术节点
MATCH (t:Technology)-[:RELATED_TO*1..2]-(ai:Technology {name: "人工智能"})
RETURN DISTINCT t.name, t.description
ORDER BY t.popularity DESC
LIMIT 20
方法3: 混合查询构建
场景：需要同时处理向量搜索和结构化过滤

class HybridQueryConstructor:
    def __init__(self, llm, vectorstore):
        self.llm = llm
        self.vectorstore = vectorstore
    def construct_query(self, natural_language_query):
        """
        将自然语言转换为混合查询
        """
        # Step 1: LLM分析查询意图
        analysis_prompt = f"""分析以下查询，提取出：
        1. 语义搜索部分（用于向量检索）
        2. 结构化过滤条件（用于元数据过滤）
        查询: {natural_language_query}
        返回JSON:
        {{
            "semantic_query": "语义搜索部分",
            "filters": {{
                "field1": "value1",
                "field2": {{"operator": "gte", "value": xxx}}
            }}
        }}
        """
        analysis = self.llm.invoke(analysis_prompt)
        parsed = json.loads(analysis.content)
        # Step 2: 构建混合查询
        semantic_query = parsed["semantic_query"]
        filters = parsed["filters"]
        # Step 3: 执行检索
        results = self.vectorstore.similarity_search(
            semantic_query,
            k=10,
            filter=filters
        )
        return results

#使用示例
constructor = HybridQueryConstructor(llm, vectorstore)

query = "找出2023年之后发布的、关于深度学习的、评分大于4分的文章"
#自动分解为:
semantic_query: "深度学习相关的技术文章"
filters: {
"publish_date": {"$gte": "2023-01-01"},
"category": "深度学习",
"rating": {"$gt": 4}
}

results = constructor.construct_query(query)
Query Construction的错误处理
关键问题：LLM生成的SQL可能有错误！

class SafeSQLExecutor:
    def __init__(self, db, llm):
        self.db = db
        self.llm = llm
        self.max_retries = 3
    def execute_with_retry(self, natural_query):
        """
        带重试机制的SQL执行
        """
        for attempt in range(self.max_retries):
            try:
                # 生成SQL
                sql = self._generate_sql(natural_query)
                print(f"尝试 {attempt + 1}: {sql}")
                # 执行前验证
                if not self._validate_sql(sql):
                    raise ValueError("SQL验证失败：可能包含危险操作")
                # 执行查询
                result = self.db.execute(sql)
                return result
            except Exception as e:
                error_msg = str(e)
                print(f"❌ 错误: {error_msg}")
                if attempt < self.max_retries - 1:
                    # 让LLM修正错误
                    natural_query = f"""上次查询失败了。
                    原查询: {natural_query}
                    生成的SQL: {sql}
                    错误信息: {error_msg}
                    请修正SQL并重试。
                    """
                else:
                    return f"查询失败，已重试{self.max_retries}次: {error_msg}"
    def _validate_sql(self, sql):
        """
        SQL安全验证
        """
        # 检查危险关键词
        dangerous_keywords = ["DROP", "DELETE", "TRUNCATE", "ALTER", "CREATE"]
        sql_upper = sql.upper()
        for keyword in dangerous_keywords:
            if keyword in sql_upper:
                return False
        # 检查是否只读查询
        if not sql_upper.strip().startswith("SELECT"):
            return False
        return True
    def _generate_sql(self, query):
        """生成SQL"""
        prompt = f"""将以下自然语言转换为SQL查询。
        数据库schema:
        - orders表: order_id, customer_id, product_name, amount, order_date
        - customers表: customer_id, name, city, age
        - products表: product_id, product_name, category, price
        查询: {query}
        只返回SQL语句，不要有其他文字：
        """
        response = self.llm.invoke(prompt)
        return response.content.strip()

#使用示例
executor = SafeSQLExecutor(db, llm)
result = executor.execute_with_retry("2024年哪些城市的订单金额最高？")
Query Construction性能优化

#1. 缓存常见查询模式
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_sql_generation(query_template):
    """缓存SQL生成结果"""
    return llm.invoke(query_template)

#2. 预编译查询模板
QUERY_TEMPLATES = {
    "top_n_by_metric": """
        SELECT {column}, SUM({metric}) as total
        FROM {table}
        WHERE {date_column} BETWEEN '{start}' AND '{end}'
        GROUP BY {column}
        ORDER BY total DESC
        LIMIT {n}
    """,
    "user_filter": """
        SELECT * FROM {table}
        WHERE {filter_conditions}
    """
}

def quick_sql_from_template(query_type, **params):
    template = QUERY_TEMPLATES.get(query_type)
    return template.format(**params)

#3. 并行查询优化
async def parallel_multi_query(queries):
    """并行执行多个查询"""
    import asyncio
    tasks = [asyncio.create_task(execute_query(q)) for q in queries]
    results = await asyncio.gather(*tasks)
    return results

小结
第二部分我们深入学习了：
🎯 路由优化（Routing）
逻辑路由：基于规则和LLM分类
语义路由：基于向量相似度
多路由策略：同时查询多个数据源并融合结果
最佳实践：5-20个主题、添加fallback、A/B测试
🔧 查询构建（Query Construction）
Text-to-SQL：自然语言转SQL查询
Text-to-Cypher：图数据库查询构建
混合查询：向量检索 + 结构化过滤
错误处理：重试机制、SQL验证、安全检查
💡 关键洞察
路由是分类问题，但分类器可以是LLM（灵活）或embedding（快速）
查询构建的核心是让LLM学会"说数据库的方言"
安全第一：永远要验证LLM生成的查询语句
性能优化：缓存、模板、并行都很重要



索引生成优化篇：Multi-representation、RAPTOR、ColBERT

一、传统RAG索引的痛点
在深入讲解优化方案之前，咱们得先明白传统RAG索引到底有什么问题。
1.1 信息瓶颈问题
想象一下，你有一篇5000字的技术文档，传统方法是把它切成500字的小块，然后每个块生成一个768维的向量。问题来了：500字的信息被压缩成768个数字，这就像把一张高清照片压缩成缩略图，很多细节都丢失了。

💡 举个栗子
假设文档里有这么一段："亚马逊雨林覆盖了巴西西北部的大部分地区，延伸到哥伦比亚、秘鲁等南美国家，是世界上最大的热带雨林，以其生物多样性而闻名。"
传统单向量方法会把这段话压缩成一个向量，当用户问"亚马逊雨林主要在哪些国家"时，模型可能只能捕捉到"亚马逊"和"国家"这些关键词，但具体的地理关系就模糊了。
1.2 上下文割裂
文档被切块后，原本连贯的上下文被强行分割。比如一个技术概念的定义在第3块，应用场景在第4块，而用户问题可能需要同时理解这两部分才能回答好。传统方法往往只能检索到其中一块，导致回答不完整。
1.3 检索精度不足
当查询比较抽象或需要多跳推理时，简单的向量相似度匹配往往力不从心。比如用户问"这项技术对行业的长远影响是什么"，这种高层次的问题需要综合多个文档片段才能回答，但传统方法可能只返回一些表面相关的内容。
【传统RAG索引流程对比优化后的方案】
image.png



二、Multi-representation Indexing（多表示索引）
2.1 核心思想
Multi-representation Indexing的核心思想非常巧妙：用优化后的表示进行检索，但返回完整的原始内容。就像我们在图书馆查书，通过简洁的索引卡找书，但最终拿到的是完整的书本。
具体来说，这个方法会为每个文档块创建两份内容：
优化表示：通常是一个简洁的摘要，只包含核心信息，用于检索时的向量匹配
原始内容：完整的文档块，包含所有细节，用于最终提供给LLM
为什么要这么做？
因为摘要更纯粹、更聚焦，去除了冗余信息，向量化后更容易匹配到用户的真实意图。但摘要毕竟信息量有限，所以检索时用摘要，返回时给完整内容，两全其美！
2.2 详细架构设计
【Multi-representation Indexing 完整架构】
image.png

2.3 实现细节与代码示例
第一步：加载和切分文档
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import WebBaseLoader

#加载文档
loader = WebBaseLoader("https://example.com/technical-doc")
docs = loader.load()

#切分文档 - 每块500个token
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = text_splitter.split_documents(docs)
第二步：生成摘要（关键！）
这一步是整个方法的核心。我们使用LLM为每个文档块生成简洁的摘要。摘要质量直接影响检索效果，所以prompt设计非常重要。
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

#初始化LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

#设计摘要prompt - 这里很关键！
summary_prompt = ChatPromptTemplate.from_template(
    """请为以下文档生成一个简洁的摘要，保留所有关键信息和核心概念。
    摘要应该：
    1. 包含主要技术点和概念
    2. 保留重要的数字、日期、人名等关键事实
    3. 长度控制在原文的1/3左右
    4. 使用清晰简洁的语言
    文档内容：
    {doc}
    摘要："""
)

#创建摘要生成链
summarize_chain = (
    {"doc": lambda x: x.page_content}
    | summary_prompt
    | llm
    | StrOutputParser()
)

#批量生成摘要 - 使用batch提高效率
summaries = summarize_chain.batch(chunks, {"max_concurrency": 5})

print(f"生成了 {len(summaries)} 个摘要")
print(f"原始文档平均长度: {sum(len(c.page_content) for c in chunks)/len(chunks):.0f} 字符")
print(f"摘要平均长度: {sum(len(s) for s in summaries)/len(summaries):.0f} 字符")

💡 摘要生成的技巧
如果文档是技术类的，prompt要强调保留技术术语和关键概念
如果是商业文档，要保留数字、日期、公司名等关键信息
摘要长度建议是原文的1/4到1/3，太短会丢信息，太长失去优势
可以尝试让LLM生成多种形式的摘要：技术摘要、业务摘要、关键词等
第三步：构建MultiVectorRetriever
这是最关键的一步！我们需要同时维护向量存储和文档存储，并通过唯一ID关联它们。
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.storage import InMemoryStore
from langchain.retrievers.multi_vector import MultiVectorRetriever
import uuid

#1. 初始化向量存储 - 存摘要的embedding
vectorstore = Chroma(
    collection_name="summaries",
    embedding_function=OpenAIEmbeddings()
)

#2. 初始化文档存储 - 存完整的原始chunk
docstore = InMemoryStore()  # 生产环境建议用持久化存储如Redis

#3. 创建MultiVectorRetriever
retriever = MultiVectorRetriever(
    vectorstore=vectorstore,
    docstore=docstore,
    id_key="doc_id"  # 关联的key
)

#4. 为每个文档生成唯一ID
doc_ids = [str(uuid.uuid4()) for _ in chunks]

#5. 创建摘要文档（用于向量化）
summary_docs = [
    Document(page_content=s, metadata={"doc_id": doc_ids[i]})
    for i, s in enumerate(summaries)
]

#6. 同时添加到两个存储
#向量存储存摘要
retriever.vectorstore.add_documents(summary_docs)
#文档存储存完整chunk
retriever.docstore.mset(list(zip(doc_ids, chunks)))

print("✅ MultiVectorRetriever 构建完成！")
第四步：执行检索

#使用MultiVectorRetriever进行检索
query = "什么是RAG系统的主要优势？"

#检索 - 内部流程：
#1. 将query向量化
#2. 在摘要向量中找最相似的top-k
#3. 通过doc_id找到对应的完整文档
#4. 返回完整文档
retrieved_docs = retriever.get_relevant_documents(query, k=3)

print(f"检索到 {len(retrieved_docs)} 个相关文档")
for i, doc in enumerate(retrieved_docs):
    print(f"\n📄 文档 {i+1}:")
    print(f"长度: {len(doc.page_content)} 字符")
    print(f"内容预览: {doc.page_content[:200]}...")
2.4 算法原理深度解析
相似度计算
Multi-representation Indexing的检索过程本质上是一个两阶段的相似度计算：
阶段1：摘要匹配

similarity(q, sᵢ) = cosine(Eq, Esᵢ)
其中 Eq 是查询向量，Esᵢ 是第i个摘要的向量
阶段2：文档返回

returned_docs = {dⱼ | ID(dⱼ) ∈ TopK({ID(sᵢ)})}
返回TopK个摘要对应的完整文档
为什么这样更有效？
信噪比提升：摘要去除了冗余信息，提高了向量的"纯度"
语义聚焦：摘要更聚焦核心概念，与用户查询的语义对齐更好
完整性保证：最终返回完整文档，不会丢失任何细节信息
2.5 性能提升数据


💡 权衡分析
可以看到，Multi-representation方法在检索质量上有显著提升（准确率+14%，精确率+13%），但代价是：
检索时间增加12.5%（主要是生成摘要的开销）
存储空间增加20%（需要同时存储摘要和原文）
这个权衡在大多数场景下是值得的，特别是当你的应用对检索质量要求很高时。
2.6 最佳实践与优化建议
摘要策略选择
不同场景可以采用不同的摘要策略：
🔹 技术文档

tech_summary_prompt = """
提取以下技术文档的核心要点：
主要技术概念和术语
关键算法或方法
重要的数字、公式或配置参数
技术优势和适用场景

保持技术术语的准确性，不要用通俗语言替换专业术语。

文档：{doc}
"""
🔹 商业文档

business_summary_prompt = """
总结以下商业文档的关键信息：
涉及的公司、产品或项目名称
重要的日期、数字、金额
主要业务逻辑或决策
关键利益相关者

保留所有专有名词和具体数据。

文档：{doc}
"""
多粒度摘要
高级技巧：为同一个文档生成不同粒度的摘要，可以进一步提升检索效果。

#生成三种摘要
def create_multi_level_summaries(chunk):
    # 1. 关键词摘要（最短）
    keywords = extract_keywords(chunk, top_k=10)
    # 2. 一句话摘要（中等）
    one_sentence = llm.invoke(f"用一句话总结：{chunk}")
    # 3. 段落摘要（较详细）
    paragraph = llm.invoke(f"用一段话总结，保留关键细节：{chunk}")
    return {
        "keywords": keywords,
        "one_sentence": one_sentence,
        "paragraph": paragraph,
        "original": chunk
    }

#检索时可以根据查询类型选择合适粒度的摘要
缓存优化
摘要生成是计算密集型操作，做好缓存可以显著提升性能：
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def get_summary(doc_hash):
    # 通过文档hash查找缓存
    # 如果缓存未命中，才调用LLM生成摘要
    pass

#使用
doc_hash = hashlib.md5(chunk.encode()).hexdigest()
summary = get_summary(doc_hash)

三、RAPTOR（递归抽象处理树状检索）
3.1 核心思想与动机
RAPTOR是2024年斯坦福大学研究团队提出的革命性索引方法。它解决了一个传统RAG的根本性问题：如何同时回答低层次的具体问题和高层次的抽象问题？

💡 举个实际例子
假设你有一本关于AI发展史的书。用户可能问两类截然不同的问题：
低层次问题："1956年达特茅斯会议的参与者有谁？" - 这需要检索到具体的某一页
高层次问题："AI发展经历了哪几个重要阶段？" - 这需要综合整本书的内容
传统的chunk-based检索对第一类问题还行，但对第二类问题就捉襟见肘了。RAPTOR通过构建层次化的摘要树完美解决了这个问题！
3.2 RAPTOR架构详解
【RAPTOR 递归树状结构完整示意图】
image.png

3.3 RAPTOR核心算法流程
算法步骤1️⃣：文档切分与向量化
首先将文档切分成小块（叶子节点），并为每个块生成embedding向量。

#步骤1: 加载和切分文档
from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # RAPTOR通常用较大的chunk
    chunk_overlap=100
)

#切分文档
leaf_texts = text_splitter.split_documents(documents)

#为每个叶子节点生成embedding
from langchain.embeddings import OpenAIEmbeddings
embeddings = OpenAIEmbeddings()

leaf_embeddings = embeddings.embed_documents(
    [doc.page_content for doc in leaf_texts]
)
算法步骤2️⃣：聚类（使用GMM）
RAPTOR使用高斯混合模型(GMM)进行聚类，而不是传统的K-means。为什么？因为GMM是软聚类，一个文档可以部分属于多个集群，这更符合实际情况。
from sklearn.mixture import GaussianMixture
import numpy as np

def cluster_embeddings(embeddings, n_clusters):
    """
    使用GMM进行软聚类
    """
    # 降维（可选，但推荐用于大规模数据）
    from umap import UMAP
    reducer = UMAP(n_components=10, random_state=42)
    reduced_embeddings = reducer.fit_transform(embeddings)
    # GMM聚类
    gmm = GaussianMixture(
        n_components=n_clusters,
        covariance_type='full',
        random_state=42
    )
    gmm.fit(reduced_embeddings)
    # 获取每个样本对各集群的概率
    probabilities = gmm.predict_proba(reduced_embeddings)
    # 使用全局阈值确定每个样本所属的集群
    threshold = 1 / n_clusters  # 动态阈值
    clusters = {}
    for i, probs in enumerate(probabilities):
        # 一个文档可以属于多个集群（软聚类的优势）
        for cluster_id in np.where(probs > threshold)[0]:
            if cluster_id not in clusters:
                clusters[cluster_id] = []
            clusters[cluster_id].append(i)
    return clusters

#执行第一次聚类
n_clusters = len(leaf_texts) // 5  # 每5个文档聚为一类
level1_clusters = cluster_embeddings(leaf_embeddings, n_clusters)

💡 为什么用GMM而不是K-means？
软聚类：一个文档可能同时涉及多个主题，GMM允许它属于多个集群
概率输出：GMM给出每个样本属于各集群的概率，我们可以设置阈值灵活控制
更好的泛化：GMM考虑了数据的协方差结构，对复杂数据分布更友好
实验证明：RAPTOR论文中的实验表明，GMM比K-means效果提升约8%
算法步骤3️⃣：生成集群摘要
对每个集群，使用LLM生成一个综合性的摘要。这是RAPTOR的关键步骤！
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4", temperature=0)

summary_prompt = ChatPromptTemplate.from_template(
    """你是一个专业的文档摘要专家。请仔细阅读以下文档片段，
    生成一个综合性的摘要，要求：
    1. 抓住所有文档的共同主题和核心思想
    2. 保留关键的细节信息（日期、人名、数字等）
    3. 体现文档之间的逻辑关系
    4. 语言简洁但信息完整
    5. 长度约为原文总和的1/4
    文档内容：
    {documents}
    综合摘要："""
)

def summarize_cluster(cluster_texts):
    """为一个集群生成摘要"""
    # 将集群内所有文档拼接
    combined_text = "\n\n---\n\n".join(cluster_texts)
    # 生成摘要
    summary = llm.invoke(
        summary_prompt.format(documents=combined_text)
    )
    return summary.content

#为每个集群生成摘要
level1_summaries = []
for cluster_id, doc_indices in level1_clusters.items():
    cluster_texts = [leaf_texts[i].page_content for i in doc_indices]
    summary = summarize_cluster(cluster_texts)
    level1_summaries.append(summary)

print(f"生成了 {len(level1_summaries)} 个一级摘要")
算法步骤4️⃣：递归构建树
这是RAPTOR最精髓的部分！我们把第一层的摘要当作新的"文档"，重复步骤2和3，继续聚类和摘要，直到达到停止条件。
def build_raptor_tree(texts, max_depth=3, min_cluster_size=3):
    """
    递归构建RAPTOR树
    Args:
        texts: 初始文档列表
        max_depth: 最大递归深度
        min_cluster_size: 最小集群大小，小于此值停止
    Returns:
        tree: 完整的树结构
    """
    tree = {
        'level_0': texts  # 叶子节点
    }
    current_texts = texts
    current_level = 0
    while current_level < max_depth:
        print(f"\n🌳 构建 Level {current_level + 1}...")
        # 1. 向量化当前层文本
        embeddings_list = embeddings.embed_documents(current_texts)
        # 2. 确定集群数
        n_clusters = max(len(current_texts) // 5, 1)
        if n_clusters < min_cluster_size:
            print(f"⚠️ 集群数 {n_clusters} 小于最小值，停止递归")
            break
        # 3. 聚类
        clusters = cluster_embeddings(embeddings_list, n_clusters)
        # 4. 为每个集群生成摘要
        next_level_texts = []
        for cluster_id, doc_indices in clusters.items():
            cluster_docs = [current_texts[i] for i in doc_indices]
            summary = summarize_cluster(cluster_docs)
            next_level_texts.append(summary)
        # 5. 保存当前层
        current_level += 1
        tree[f'level_{current_level}'] = next_level_texts
        # 6. 准备下一轮递归
        current_texts = next_level_texts
        print(f"✅ Level {current_level} 完成，生成 {len(next_level_texts)} 个摘要")
        # 停止条件：只剩一个摘要（根节点）
        if len(next_level_texts) == 1:
            print("🎯 到达根节点，树构建完成！")
            break
    return tree

#构建完整的RAPTOR树
raptor_tree = build_raptor_tree(
    texts=[doc.page_content for doc in leaf_texts],
    max_depth=3,
    min_cluster_size=3
)
3.4 RAPTOR检索策略
RAPTOR提供了两种检索策略，各有优劣：
策略1：树遍历检索 (Tree Traversal)
从根节点开始，逐层向下找最相关的分支，像在图书馆里先找分类，再找书架，最后找书。
【树遍历检索流程】
image.png

def tree_traversal_retrieval(query, tree, k=3):
    """
    树遍历检索
    Args:
        query: 用户查询
        tree: RAPTOR树结构
        k: 每层选择的top-k个节点
    Returns:
        最相关的文档列表
    """
    query_embedding = embeddings.embed_query(query)
    # 从最高层开始
    max_level = max([int(k.split('_')[1]) for k in tree.keys()])
    current_nodes = tree[f'level_{max_level}']
    for level in range(max_level, -1, -1):
        print(f"🔍 在 Level {level} 搜索...")
        # 计算相似度
        level_embeddings = embeddings.embed_documents(current_nodes)
        similarities = cosine_similarity(
            [query_embedding],
            level_embeddings
        )[0]
        # 选择top-k最相似的节点
        top_k_indices = np.argsort(similarities)[-k:][::-1]
        if level == 0:
            # 到达叶子层，返回结果
            return [current_nodes[i] for i in top_k_indices]
        # 获取下一层的子节点
        next_level_nodes = []
        for idx in top_k_indices:
            # 这里需要维护父子关系映射
            children = get_children(tree, level, idx)
            next_level_nodes.extend(children)
        current_nodes = next_level_nodes
    return current_nodes
策略2：扁平化检索 (Collapsed Tree)
把所有层的节点（包括原始文档和各层摘要）都放在一起，一次性检索。简单高效，是推荐的方法！
def collapsed_tree_retrieval(query, tree, k=5):
    """
    扁平化检索 - 将所有层级的节点放在一起检索
    这是推荐的方法，因为：
    1. 实现简单
    2. 不会错过任何相关信息
    3. 可以同时获得不同抽象层次的内容
    """
    # 1. 收集所有层的所有节点
    all_nodes = []
    node_metadata = []  # 记录每个节点的元信息
    for level_key, nodes in tree.items():
        level = int(level_key.split('_')[1])
        for i, node in enumerate(nodes):
            all_nodes.append(node)
            node_metadata.append({
                'level': level,
                'index': i,
                'is_leaf': (level == 0)
            })
    print(f"📚 共收集到 {len(all_nodes)} 个节点")
    # 2. 向量化所有节点
    all_embeddings = embeddings.embed_documents(all_nodes)
    # 3. 向量化查询
    query_embedding = embeddings.embed_query(query)
    # 4. 计算相似度并排序
    from sklearn.metrics.pairwise import cosine_similarity
    similarities = cosine_similarity(
        [query_embedding],
        all_embeddings
    )[0]
    # 5. 获取top-k
    top_k_indices = np.argsort(similarities)[-k:][::-1]
    # 6. 返回结果，包含元信息
    results = []
    for idx in top_k_indices:
        results.append({
            'content': all_nodes[idx],
            'similarity': similarities[idx],
            'metadata': node_metadata[idx]
        })
    return results

#使用示例
query = "AI发展经历了哪些重要阶段？"
results = collapsed_tree_retrieval(query, raptor_tree, k=5)

for i, result in enumerate(results):
    print(f"\n📄 结果 {i+1} (相似度: {result['similarity']:.3f})")
    print(f"层级: Level {result['metadata']['level']}")
    print(f"内容: {result['content'][:200]}...")

💡 为什么推荐扁平化检索？
全面性：不会因为在某一层选错分支而错过相关内容
灵活性：对于不同抽象层次的问题，都能找到合适的答案
实现简单：不需要维护复杂的父子关系，一次向量化搞定
实验验证：RAPTOR论文实验表明，扁平化检索在大多数任务上优于树遍历
举个例子：当用户问"AI发展经历了哪些阶段"，扁平化检索可能同时返回：
Level 2的全局摘要（提供整体框架）
Level 1的具体阶段摘要（提供中层细节）
Level 0的某些原始文档（提供具体例证）
这样的组合提供了多层次、立体化的答案！
3.5 RAPTOR性能分析与优化
性能数据对比


📊 数据解读
RAPTOR在复杂问题和高层次理解方面有巨大优势（提升20%-29%），但代价是：
构建时间长：需要多轮LLM调用生成摘要，时间是传统方法的7倍
存储开销大：需要存储所有层级的节点，空间增加80%
检索略慢：扁平化方法需要搜索更多节点
适用场景：对于需要理解长文档、回答复杂问题、进行多跳推理的应用，RAPTOR非常值得！
优化建议
缓存机制
构建一次树就缓存起来，避免重复计算：
import pickle
import hashlib

def cache_raptor_tree(tree, docs_hash):
    """缓存RAPTOR树"""
    cache_file = f"raptor_tree_{docs_hash}.pkl"
    with open(cache_file, 'wb') as f:
        pickle.dump(tree, f)

def load_raptor_tree(docs_hash):
    """加载缓存的树"""
    cache_file = f"raptor_tree_{docs_hash}.pkl"
    if os.path.exists(cache_file):
        with open(cache_file, 'rb') as f:
            return pickle.load(f)
    return None

#使用
docs_hash = hashlib.md5(str(documents).encode()).hexdigest()
tree = load_raptor_tree(docs_hash)
if tree is None:
    tree = build_raptor_tree(documents)
    cache_raptor_tree(tree, docs_hash)
并行化处理
摘要生成可以并行化，大幅提升速度：
from concurrent.futures import ThreadPoolExecutor

def parallel_summarize(clusters, max_workers=5):
    """并行生成摘要"""
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        summaries = list(executor.map(
            summarize_cluster,
            [cluster_texts for cluster_texts in clusters.values()]
        ))
    return summaries

#速度提升5倍！
使用更快的LLM
生产环境中，可以用较小的模型生成摘要：
#用GPT-3.5生成摘要，速度快3倍，成本降低10倍
fast_llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

#或者用开源模型
from langchain.llms import LlamaCpp
local_llm = LlamaCpp(model_path="./models/llama-2-7b.gguf")

四、ColBERT（Token级别上下文检索）
4.1 核心思想
ColBERT(Contextualized Late Interaction over BERT)是一个非常巧妙的模型！传统的embedding把整个文档压缩成一个向量，而ColBERT把每个token（词）都变成一个向量，保留了更细粒度的信息。

💡 形象的比喻
想象你要找一本书：
传统方法：就像只看书的封面和目录（单向量）
ColBERT方法：就像把书的每一页都看了一遍（多向量）
哪个更可能找到你要的内容？显然是后者！
4.2 ColBERT详细架构
image.png

4.3 MaxSim算法详解
ColBERT的核心算法是MaxSim（Maximum Similarity）。让我用一个具体例子来解释：
场景设置
假设：
查询Q = ["major", "cities", "Amazon", "river"]（4个token）
文档D = ["cities", "along", "the", "Amazon", "river", "include", "Manaus", "and", "Iquitos"]（9个token）
MaxSim算法流程
Step 1: 向量化

Q = [v_major, v_cities, v_Amazon, v_river] ∈ ℝ^(4×128)
D = [v_cities, v_along, ..., v_Iquitos] ∈ ℝ^(9×128)
每个token都是一个128维向量
Step 2: 对查询的每个token，找文档中最相似的token

MaxSim(v_major, D) = max(sim(v_major, v_i)) for all v_i ∈ D
MaxSim(v_cities, D) = max(sim(v_cities, v_i)) for all v_i ∈ D
...
Step 3: 求和得到最终相似度分数

Score(Q, D) = Σ MaxSim(v_qᵢ, D)
将每个查询token的最大相似度加起来
具体计算示例
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

#假设的向量（简化为3维演示）
query_vectors = np.array([
    [0.8, 0.2, 0.1],  # "major"
    [0.1, 0.9, 0.2],  # "cities"
    [0.3, 0.1, 0.8],  # "Amazon"
    [0.2, 0.3, 0.7],  # "river"
])

doc_vectors = np.array([
    [0.2, 0.9, 0.1],  # "cities"
    [0.5, 0.4, 0.3],  # "along"
    [0.4, 0.1, 0.9],  # "Amazon"
    [0.3, 0.2, 0.8],  # "river"
    [0.6, 0.3, 0.2],  # "Manaus"
])

def maxsim_score(query_vecs, doc_vecs):
    """
    计算MaxSim分数
    """
    total_score = 0
    for i, q_vec in enumerate(query_vecs):
        # 计算这个查询token与所有文档token的相似度
        similarities = cosine_similarity([q_vec], doc_vecs)[0]
        # 取最大值
        max_sim = np.max(similarities)
        max_idx = np.argmax(similarities)
        total_score += max_sim
        print(f"查询token {i} 最匹配文档token {max_idx}, 相似度: {max_sim:.3f}")
    return total_score

score = maxsim_score(query_vectors, doc_vectors)
print(f"\n总分数: {score:.3f}")

💡 为什么MaxSim这么有效？
细粒度匹配：每个词都能找到文档中最相关的对应，不会被无关词干扰
上下文感知：因为用的是BERT，每个token的向量都包含了上下文信息
灵活性：查询和文档的长度可以完全不同，算法会自动适应
可解释性：可以看到每个查询词具体匹配到文档的哪个词
4.4 ColBERT实战代码
好消息！我们有一个超级好用的库RAGatouille，让ColBERT的使用变得超级简单：
第一步：安装和初始化

#安装
!pip install ragatouille

#初始化ColBERT模型
from ragatouille import RAGPretrainedModel

#加载预训练的ColBERT v2模型
RAG = RAGPretrainedModel.from_pretrained("colbert-ir/colbertv2.0")

print("✅ ColBERT模型加载完成！")
第二步：索引文档

#准备文档
documents = [
    "RAG is a technique that combines retrieval and generation.",
    "ColBERT uses token-level embeddings for better retrieval.",
    "BERT is a transformer-based language model.",
    "Vector databases store embeddings for similarity search.",
    "Large language models can generate human-like text."
]

#创建索引 - ColBERT会自动处理token化和embedding
index_path = RAG.index(
    collection=documents,
    index_name="my_colbert_index",
    max_document_length=256,  # 文档最大长度
    split_documents=True       # 是否自动切分长文档
)

print(f"✅ 索引创建完成，保存在: {index_path}")
第三步：搜索

#搜索
query = "How does ColBERT improve retrieval?"

results = RAG.search(
    query=query,
    k=3  # 返回top-3结果
)

#打印结果
for i, result in enumerate(results):
    print(f"\n📄 Result {i+1} (Score: {result['score']:.3f})")
    print(f"Content: {result['content']}")
    print(f"Document ID: {result['document_id']}")
高级用法：Reranking
ColBERT的一个杀手级应用是用来重排序！你可以先用其他方法（如BM25或简单的向量检索）快速找到候选集，然后用ColBERT精排。

#假设你已经用BM25找到了100个候选文档
candidate_docs = [...]  # 100个文档

#用ColBERT重排序 - 不需要预先建立索引！
colbert = RAGPretrainedModel.from_pretrained("colbert-ir/colbertv2.0")

reranked_results = colbert.rerank(
    query="What is machine learning?",
    documents=candidate_docs,
    k=10  # 只保留top-10
)

#ColBERT会根据MaxSim分数重新排序
for i, doc in enumerate(reranked_results):
    print(f"{i+1}. {doc['content'][:100]}... (Score: {doc['score']:.3f})")
4.5 ColBERT性能与权衡


⚖️ ColBERT的权衡
优势：
检索质量大幅提升（+17%到+20%）
对复杂查询和长尾词表现优异
可解释性强，能看到词级别的匹配
劣势：
存储开销巨大（12倍！）
检索速度较慢（3倍多）
需要更多内存（24倍！）
推荐策略：
小规模数据（<100万文档）：直接用ColBERT
大规模数据（>1000万文档）：用混合方法，先用向量粗排，ColBERT精排
对质量要求极高：咬咬牙用ColBERT，存储成本值得！
4.6 ColBERT v2的优化
ColBERT v2在v1的基础上做了重大优化，主要是压缩：
残差压缩 (Residual Compression)
ColBERT v2使用了一个聪明的技巧：每个token向量不是完整存储，而是存储为一个质心(centroid)加上一个残差(residual)。
残差压缩公式

v_token = centroid_k + residual_token

其中：
• centroid_k 是最近的质心向量（从少量质心中选择）
• residual_token 是低精度的差值（1-2bit量化）

存储从 128×32bit 降低到 ID×log₂(n_centroids) + 128×1bit
约为原来的1/6！
#ColBERT v2的索引自动使用压缩
RAG_v2 = RAGPretrainedModel.from_pretrained("colbert-ir/colbertv2.0")

#创建压缩索引
index = RAG_v2.index(
    collection=documents,
    index_name="compressed_index",
    # ColBERT v2会自动：
    # 1. 学习质心（通常2048或4096个）
    # 2. 对残差进行1-2bit量化
    # 3. 存储压缩后的表示
)

#索引大小从 154GB 降低到 16GB（1bit）或 25GB（2bit）
#检索质量基本不变！

五、三种方法对比与选型指南
5.1 全面对比

5.2 选型决策树
image.png



六、Retrieval检索和Generation生成优化策略
嗨，朋友们！今天咱们来深入聊聊RAG系统中最关键的两个环节——检索（Retrieval） 和 生成（Generation） 的优化策略。你可能会问，为啥要优化这两个环节？简单来说，就是要让AI系统更聪明、更准确、更靠谱！
想象一下，你在图书馆找资料，如果你找到的书跟你要查的内容八竿子打不着，那后面写的报告肯定也是驴唇不对马嘴。RAG系统也是一样的道理——检索质量决定了生成质量。

6.1 Retrieval检索优化策略
什么是检索优化？
检索优化就是在索引的基础上，通过各种技巧和策略，让系统更准确地找到用户真正需要的信息。咱们可以把它想象成一个超级图书管理员，不仅知道书在哪儿，还知道哪本书最适合你的需求。
完成对问题的改写、不同知识库查询的构建以及路由分发、查询构建和索引生成优化之后，我们可以进一步优化Retrieval检索。主要包括以下几个方面：
Ranking（排序）：对检索结果进行初步排序
Refinement（精炼）：对检索结果进行过滤和优化
Adaptive Retrieval（自适应检索）：根据查询特征动态调整检索策略
检索的几种主要类型
父文档检索（Parent Document Retrieval）
这个概念听起来有点抽象，我用个生活化的例子来解释：
假设你在看一本书，目录上写着"第三章：人工智能的发展"。你点开目录（小分块），但实际阅读的是整个第三章的内容（父文档）。这就是父文档检索的核心思想！
为什么需要父文档检索？
检索时：小分块更精准，embedding能更准确地反映含义
生成时：大文档更完整，能保留足够的上下文信息
三种实现方式：
方式一：小块检索 → 父文档返回

检索小分块 → 找到对应的父文档 → 返回完整的父文档/更大的分块
方式二：摘要检索 → 原文返回

LLM生成文档摘要 → 对摘要进行embedding → 检索摘要 → 返回原始文档
方式三：假设性问题检索

LLM为文档生成假设性问题 → embedding问题 → 检索问题 → 返回原文档
💡 举个实际例子：

原始文档（1000字）：详细介绍了如何使用Python进行数据分析...
↓
生成摘要（100字）："本文介绍Python数据分析的核心技术..."
↓
用户查询："如何用Python做数据分析？"
↓
检索到摘要（相似度高）→ 返回完整的1000字原文档
层级检索（Hierarchical Retrieval）
想象你在一个超大型图书馆找书，如果逐本翻看，效率太低。更聪明的做法是：
先看每个分类的总目录（摘要）
确定大致范围
再在特定分类里细找（文档块）
两步检索策略：
image.png

实际案例：RAPTOR（层级检索的经典实现）
RAPTOR将文档组织成树状结构：
叶节点：原始文档块
中间节点：多个文档块的摘要
根节点：整个文档集的总摘要
混合检索（Fusion Retrieval）

现实世界的检索需求千变万化，单一方法往往力不从心。混合检索就是把不同检索策略的优势结合起来！
最常见的组合：稀疏检索 + 密集检索

举个例子：

用户查询："iPhone 15 Pro的价格"

向量搜索：可能找到关于"苹果新款手机定价"的内容
关键词搜索：精确匹配"iPhone 15 Pro"和"价格"

混合检索结果 = 两者结合，既准又全！
RRF算法详解（Reciprocal Rank Fusion）
RRF是混合检索中最核心的融合算法，由滑铁卢大学和谷歌联合开发。
算法公式：

$$ RRF(d) = \\sum_{i=1}^{n} \\frac{1}{k + r_i(d)} $$
其中：
$d$ 是文档
$n$ 是检索系统的数量
$r_i(d)$ 是文档 $d$ 在第 $i$ 个检索器中的排名（排名越靠前值越小）
$k$ 是常数，通常取60，用于防止低排名项权重过高
实际计算案例：
假设我们有两个检索器（向量搜索和关键词搜索），检索结果如下：

文档A：
向量搜索排名：1
关键词搜索排名：3
RRF(A) = 1/(60+1) + 1/(60+3) = 1/61 + 1/63 = 0.0164 + 0.0159 = 0.0323

文档B：
向量搜索排名：2
关键词搜索排名：1
RRF(B) = 1/(60+2) + 1/(60+1) = 1/62 + 1/61 = 0.0161 + 0.0164 = 0.0325

文档C：
向量搜索排名：5
关键词搜索排名：2
RRF(C) = 1/(60+5) + 1/(60+2) = 1/65 + 1/62 = 0.0154 + 0.0161 = 0.0315
最终排序：B > A > C
为什么k设为60？
k=60是经验值，这个值能够很好地平衡不同排名位置的权重：
如果k太小（如k=10），低排名文档权重过高
如果k太大（如k=200），高排名文档优势不明显
权重调整技巧：

#更重视向量搜索
k_vector = 30
k_keyword = 90

#更重视关键词搜索
k_vector = 90
k_keyword = 30
TM2C2算法：RRF的进化版
2023年，Pinecone和伯克利的研究人员提出了TM2C2算法（Theoretical Min-Max Convex Combination），它有以下优势：
更稳定：相比传统的min-max归一化
性能更好：在大多数数据集上优于RRF
更可解释：α参数直观表示语义搜索和关键词搜索的相对重要性
样本效率高：只需很少训练样本就能达到好效果
多向量检索（Multi-Vector Retrieval）
一份文档可以有多种embedding方式！就像一个人可以有多张不同角度的照片。
典型场景：半结构化文档（文本+表格）

原始文档：

├── 文本部分 → embedding_text
├── 表格部分 → 生成摘要 → embedding_table_summary
└── 图片部分 → 多模态embedding → embedding_image

检索时可以同时使用三种embedding，提高召回率！
实际案例：

用户查询："2023年第三季度销售额对比"

传统方法：只能检索文本
多向量方法：
    检索文本描述
    检索表格（包含具体数据）
    检索图表（可视化展示）

返回时：摘要用于匹配，但实际返回原始表格给LLM

6.2 Re-ranking重排
为什么需要Re-ranking？
你有没有遇到过这种情况：Google搜索前10个结果里，最有用的那个藏在第7位？Re-ranking就是为了解决这个问题！
核心问题： 检索出来的chunks并不一定完全和问题相关，直接提交给LLM可能导致：
生成结果质量不佳
包含无关信息
浪费token成本
解决思路：借鉴推荐系统的做法

粗排（Coarse Ranking）：基于Embedding快速筛选
    ↓
精排（Fine-grained Ranking）：专门的排序引擎深度评分
    ↓
Top-K选择：挑选最相关的内容
Re-ranking架构图
image.png

两种主要实现方式
方式一：专门的排序引擎
Cohere Rerank（商业化首选）
Cohere Rerank 3是目前最先进的重排模型，具有以下特点：
核心优势：
✨ 4K上下文长度窗口（2025年最新版本）
✨ 支持多方面和半结构化数据（邮件、发票、JSON、代码、表格）
✨ 100+语言支持
✨ 低延迟、低成本
✨ 企业级精度
工作原理：
Cohere Rerank使用交叉编码器（Cross-Encoder）架构：

输入：(查询, 文档) 配对
     ↓
Transformer同时处理查询和文档
     ↓
深度交互捕获语义关系
     ↓
输出：相关性分数（0-1之间）
实际代码示例（LangChain）：
from langchain_cohere import CohereRerank
from langchain_core.documents import Document

#初始化Cohere Rerank
cohere_rerank = CohereRerank(
    api_key="your_api_key",
    model="rerank-english-v3.0",  # 2025最新模型
    top_n=5
)

#查询
query = "What is the capital of the United States?"

#候选文档
docs = [
    Document(pageContent="Carson City is the capital of Nevada..."),
    Document(pageContent="Washington, D.C. is the capital and largest city of the United States..."),
    Document(pageContent="The Commonwealth of the Northern Mariana Islands..."),
    Document(pageContent="Capital punishment has existed in the US since...")
]

#重排序
reranked_docs = cohere_rerank.rerank(docs, query, top_n=5)

#结果示例：
[
{ index: 1, relevanceScore: 0.987 },  # Washington, D.C.
{ index: 0, relevanceScore: 0.089 },  # Carson City
{ index: 2, relevanceScore: 0.041 }   # Commonwealth
]
Cohere Rerank的性能指标：

指标对比（基于BeIR Benchmark）：

┌────────────────────┬──────────┬──────────┐
│      模型          │  NDCG@10 │ 延迟(ms) │
├────────────────────┼──────────┼──────────┤
│ Cohere Rerank 3    │   0.582  │    45    │
│ Cohere Rerank 2    │   0.551  │    38    │
│ BGE Reranker       │   0.534  │    52    │
│ Cross-Encoder Mini │   0.498  │    28    │
└────────────────────┴──────────┴──────────┘
成本效益分析：
使用Rerank的ROI（投资回报率）：

场景：企业知识库搜索（10M文档）

不使用Rerank：
需要返回Top-50给LLM
GPT-4 Token成本：$0.03/1K tokens
平均每次查询tokens：15,000
单次成本：$0.45
准确率：72%

使用Rerank：
初始检索Top-100
Rerank成本：$0.002/查询
只返回Top-10给LLM
平均每次查询tokens：3,000
LLM成本：$0.09
总成本：$0.092
准确率：89%

节省：79.6%
准确率提升：17个百分点
Jina AI Rerank
Jina Rerank专注于多模态重排：
特点：
🎨 支持文本、图像、音频的联合重排
🌍 多语言支持
🚀 可本地部署
💼 企业级安全
ColBERT Reranker
ColBERT（Contextualized Late Interaction over BERT）是一种快速准确的检索模型：
核心创新：

传统Cross-Encoder：
Query + Doc → BERT → Score
（每个配对都要完整计算，慢）

ColBERT：
Query → BERT → Q_vectors (预计算)
Doc → BERT → D_vectors (预计算)
Score = MaxSim(Q_vectors, D_vectors) （快速计算）
性能对比：

检索10K文档：
    Cross-Encoder: ~5秒
    ColBERT: ~50毫秒
速度提升：100倍！
方式二：使用LLM做重排序
基本思路： 让大模型直接对文档相关性进行评分和排序。
LlamaIndex内置的重排Prompt：

以下是一些上下文：
{context}

请根据以下查询对上下文的相关性进行评分（0-10分）：
查询：{query}

对于每个上下文片段，请给出：
    相关性分数（0-10）
    简短的理由

最后，请按相关性从高到低排序。
实际示例：
from llama_index import GPTListIndex
from llama_index.indices.postprocessor import LLMRerank

#文档列表
documents = [...]

#使用GPT-4进行重排
reranker = LLMRerank(
    choice_batch_size=5,
    top_n=3,
    model="gpt-4"
)

query = "如何优化RAG系统的检索性能？"
reranked_nodes = reranker.postprocess_nodes(
    nodes=documents,
    query_str=query
)
LLM重排的评分示例：

查询："Python数据分析最佳实践"

文档A："本文介绍了使用Pandas进行数据分析的技巧..."
评分：9/10
理由：直接相关，提供了具体的实践方法

文档B："数据科学导论：从统计学到机器学习..."
评分：5/10
理由：内容相关但过于宽泛，缺少Python具体实践

文档C："Java编程入门教程..."
评分：1/10
理由：不相关，主题是Java而非Python
LLM重排的优缺点
优点：
✅ 理解能力强，能捕捉复杂的语义关系
✅ 灵活性高，可以根据需求调整prompt
✅ 可以提供排序理由，增强可解释性
缺点：
❌ 速度慢（每次调用LLM API需要时间）
❌ 成本高（LLM API调用费用）
❌ 无法全局对齐（分批处理导致的问题）
成本对比：

场景：1000次查询，每次重排10个文档

使用Cohere Rerank：
成本：$2
延迟：45ms/查询
总时间：45秒

使用GPT-4重排：
成本：$30（估算）
延迟：2000ms/查询
总时间：33分钟

Cohere Rerank更优：成本低15倍，速度快44倍
高级重排算法
RankGPT
论文：Is ChatGPT Good at Search? Investigating Large Language Models as Re-Ranking Agents
创新点：
Zero-shot重排（无需训练）
排列生成方法
滑动窗口策略
工作流程：

输入：查询 + 10个文档
     ↓
Prompt: "请将以下文档按相关性排序：..."
     ↓
GPT生成：[3, 1, 7, 2, 5, 9, 4, 10, 6, 8]
     ↓
重新排列文档顺序
RankLLM / RankVicuna / RankZephyr
特点：
基于开源LLM（Vicuna, Zephyr）
针对重排任务进行微调
可本地部署，无需API调用
微调数据构建：

#训练样本格式
{
    "query": "什么是RAG？",
    "positive_doc": "RAG是检索增强生成...",  # 高相关
    "hard_negative_doc": "生成式AI是...",    # 相关但不准确
    "negative_doc": "机器学习基础..."        # 不相关
}
实战：构建高效的Re-ranking Pipeline
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_cohere import CohereRerank
from langchain.retrievers import ContextualCompressionRetriever

#步骤1：初始向量检索（粗排）
vectorstore = Chroma(
    collection_name="rag_collection",
    embedding_function=OpenAIEmbeddings()
)
base_retriever = vectorstore.as_retriever(
    search_kwargs={"k": 50}  # 初始召回50个
)

#步骤2：Cohere重排（精排）
reranker = CohereRerank(
    api_key="your_api_key",
    model="rerank-english-v3.0",
    top_n=5  # 最终返回5个
)

#步骤3：组合成压缩检索器
compression_retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=base_retriever
)

#步骤4：执行查询
query = "如何优化RAG系统性能？"
compressed_docs = compression_retriever.get_relevant_documents(query)

#结果：从50个候选中精选出5个最相关的文档
for i, doc in enumerate(compressed_docs):
    print(f"排名 {i+1}: 相关度分数 {doc.metadata['relevance_score']:.3f}")
    print(f"内容预览: {doc.page_content[:100]}...")
Re-ranking的性能指标
评估指标：
NDCG@K (Normalized Discounted Cumulative Gain)

DCG@K = Σ(rel_i / log2(i+1))
NDCG@K = DCG@K / IDCG@K

rel_i：第i个位置文档的相关性
完美排序时NDCG = 1.0
MRR (Mean Reciprocal Rank)

MRR = 1/N * Σ(1/rank_i)

rank_i：第一个相关文档的排名
Recall@K

Recall@K = (相关文档数) / (总相关文档数)
实际案例数据：

数据集：10K文档，100个查询
评估指标对比：

┌──────────────────┬──────────┬──────────┬────────────┐
│     方法         │ NDCG@10  │   MRR    │ Recall@10  │
├──────────────────┼──────────┼──────────┼────────────┤
│ 纯向量检索       │   0.512  │  0.448   │   0.653    │
│ 向量+RRF融合     │   0.587  │  0.521   │   0.721    │
│ Cohere Rerank    │   0.698  │  0.672   │   0.843    │
│ GPT-4 Rerank     │   0.715  │  0.689   │   0.856    │
└──────────────────┴──────────┴──────────┴────────────┘

性能提升：
Cohere vs 纯向量：NDCG提升36.3%
Cohere vs RRF融合：NDCG提升18.9%
Re-ranking最佳实践建议
选择合适的方法

预算充足 + 追求极致性能 → Cohere Rerank 3
需要本地部署 → ColBERT / SentenceTransformer
中文场景 → BGE Reranker
预算有限 + 简单场景 → RRF融合
设置合理的K值

粗排Top-K：50-100（召回率优先）
精排Top-N：3-10（精确度优先）

原则：
K太小：可能漏掉相关文档
N太大：浪费LLM上下文窗口
混合策略

第一阶段：向量检索 (Top-100)
第二阶段：RRF融合 (Top-50)
第三阶段：Cohere Rerank (Top-10)
第四阶段：LLM生成

这样既保证召回，又控制成本

6.3 CRAG：纠错检索增强生成
什么是CRAG？
CRAG的全称是Corrective Retrieval-Augmented Generation（纠错检索增强生成）。简单来说，CRAG就是给RAG系统加了一个"质检员"，在把检索结果交给LLM之前，先检查一下这些内容靠不靠谱！
核心理念：

传统RAG：检索 → 直接生成
CRAG：检索 → 评估质量 → 纠错/补充 → 生成
CRAG架构图
image.png

CRAG的三大核心组件
检索评估器（Retrieval Evaluator）
作用：给每个检索到的文档打分，判断其质量和相关性。
评估维度：
相关性（Relevance）：文档是否回答了查询问题？
准确性（Accuracy）：信息是否准确可信？
完整性（Completeness）：信息是否完整充分？
评分结果分为三类：

class DocumentRelevance(Enum):
    CORRECT = "correct"        # 相关且准确，置信度 > 0.8
    INCORRECT = "incorrect"    # 不相关或错误，置信度 < 0.3
    AMBIGUOUS = "ambiguous"    # 模糊不清，0.3 <= 置信度 <= 0.8
评估器实现方式：
方式A：微调的小模型（推荐）
from transformers import AutoTokenizer, AutoModelForSequenceClassification

#使用微调的T5模型
tokenizer = AutoTokenizer.from_pretrained("google/t5-large-crag-evaluator")
model = AutoModelForSequenceClassification.from_pretrained(
    "google/t5-large-crag-evaluator",
    num_labels=3  # Correct, Incorrect, Ambiguous
)

def evaluate_document(query, document):
    """评估文档相关性"""
    input_text = f"Query: {query}\nDocument: {document}\nRelevance:"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512)
    outputs = model(**inputs)
    # 获取预测结果和置信度
    probs = torch.softmax(outputs.logits, dim=-1)
    predicted_class = torch.argmax(probs).item()
    confidence = probs[0][predicted_class].item()
    return {
        "class": ["correct", "incorrect", "ambiguous"][predicted_class],
        "confidence": confidence
    }
方式B：使用大模型（如GPT-4）
def gpt4_evaluate(query, document):
    prompt = f"""
    评估以下文档是否回答了查询问题。
    查询：{query}
    文档：{document}
    请评估文档的相关性并选择一个类别：
    - CORRECT：文档直接回答了查询，信息准确完整
    - INCORRECT：文档不相关或包含错误信息
    - AMBIGUOUS：文档部分相关但信息不够完整
    只返回类别名称，不需要解释。
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    return response.choices[0].message.content.strip()
方式C：使用Cohere Rerank作为评估器
from langchain_cohere import CohereRerank

reranker = CohereRerank(
    model="rerank-english-v3.0",
    top_n=10
)

#Rerank会返回相关性分数
results = reranker.rerank(documents, query)

#根据分数分类
for doc in results:
    if doc['relevance_score'] > 0.8:
        doc['category'] = 'CORRECT'
    elif doc['relevance_score'] < 0.3:
        doc['category'] = 'INCORRECT'
    else:
        doc['category'] = 'AMBIGUOUS'
知识精炼（Knowledge Refinement）
当文档被评为"正确"时，我们不是直接使用整个文档，而是进行知识精炼。
分解-重组算法（Decompose-Recompose）：
![image-20251027163118729](img/image-20251027163118729.png
实际案例：

原始文档（500字）：
"Python是一种广泛使用的高级编程语言，由Guido van Rossum在1989年创建。
Python的设计哲学强调代码可读性，其语法允许程序员用更少的代码表达概念。
Python支持多种编程范式，包括面向对象、命令式和函数式编程。
Python有一个庞大的标准库，被戏称为'自带电池'。
Python被广泛应用于Web开发、数据分析、人工智能、科学计算等领域。
（... 还有400字的详细历史和社区信息 ...）"

查询："Python的主要特点是什么？"

↓ 分解成知识条 ↓

知识条1："Python强调代码可读性" ✅ 相关
知识条2："Python语法简洁，用更少代码表达概念" ✅ 相关
知识条3："支持多种编程范式" ✅ 相关
知识条4："有庞大的标准库" ✅ 相关
知识条5："由Guido van Rossum在1989年创建" ❌ 不太相关
知识条6："广泛应用于多个领域" ✅ 相关

↓ 重组精炼 ↓

精炼后的上下文（150字）：
"Python的主要特点包括：
强调代码可读性
语法简洁，用更少代码表达概念
支持多种编程范式（OOP、函数式等）
拥有庞大的标准库（'自带电池'）
广泛应用于Web开发、数据分析、AI等领域"
知识精炼的Python实现：
def decompose_document(document, query):
    """将文档分解成知识条"""
    # 按句子分割
    sentences = sent_tokenize(document)
    # 使用小模型评估每个句子的相关性
    knowledge_strips = []
    for sent in sentences:
        relevance_score = compute_relevance(query, sent)
        if relevance_score > 0.6:  # 阈值可调
            knowledge_strips.append({
                'content': sent,
                'score': relevance_score
            })
    return knowledge_strips

def recompose_knowledge(knowledge_strips, max_length=500):
    """重组知识条"""
    # 按相关性排序
    sorted_strips = sorted(
        knowledge_strips,
        key=lambda x: x['score'],
        reverse=True
    )
    # 组合直到达到最大长度
    result = []
    current_length = 0
    for strip in sorted_strips:
        strip_length = len(strip['content'])
        if current_length + strip_length <= max_length:
            result.append(strip['content'])
            current_length += strip_length
        else:
            break
    return ' '.join(result)
网络搜索（Web Search）
当文档被评为"INCORRECT"时，系统会触发网络搜索来获取更可靠的信息。
查询重写（Query Rewriting）：
原始查询可能不适合网络搜索，需要重写为更适合搜索引擎的形式。

用户查询："我们公司去年的销售额增长了多少？"
↓ 检索内部文档 → 评估为INCORRECT
↓ 重写查询（移除公司特定上下文）
网络搜索查询："如何计算销售额增长率"
实现示例（使用Tavily Search API）：
from tavily import TavilyClient

def web_search_fallback(query, original_docs):
    """当检索失败时触发网络搜索"""
    # 1. 重写查询
    rewritten_query = rewrite_query_for_web(query)
    # 2. 执行网络搜索
    tavily = TavilyClient(api_key="your_api_key")
    search_results = tavily.search(
        query=rewritten_query,
        search_depth="advanced",  # 深度搜索
        max_results=5
    )
    # 3. 提取和格式化结果
    web_docs = []
    for result in search_results['results']:
        web_docs.append({
            'content': result['content'],
            'url': result['url'],
            'score': result['score']
        })
    return web_docs

def rewrite_query_for_web(query):
    """使用LLM重写查询"""
    prompt = f"""
    将以下内部查询重写为适合网络搜索的形式：
    原查询：{query}
    重写时应该：
    - 移除公司特定的上下文
    - 使用更通用的术语
    - 保持查询意图不变
    重写后的查询：
    """
    response = llm.invoke(prompt)
    return response.content.strip()
CRAG的完整工作流程
让我们通过一个完整的例子来理解CRAG的工作流程：
场景：医疗知识问答系统

#用户查询
query = "阿司匹林的主要副作用是什么？"

#步骤1：初始检索
retrieved_docs = vector_store.similarity_search(query, k=5)
#返回5个文档

#步骤2：评估每个文档
evaluation_results = []
for doc in retrieved_docs:
    eval_result = evaluate_document(query, doc)
    evaluation_results.append(eval_result)

#评估结果示例：
Doc1: {"class": "correct", "confidence": 0.92}
Doc2: {"class": "correct", "confidence": 0.85}
Doc3: {"class": "ambiguous", "confidence": 0.65}
Doc4: {"class": "incorrect", "confidence": 0.25}
Doc5: {"class": "incorrect", "confidence": 0.18}

#步骤3：根据评估结果采取行动
correct_docs = [d for d, e in zip(retrieved_docs, evaluation_results)
                if e['class'] == 'correct']
ambiguous_docs = [d for d, e in zip(retrieved_docs, evaluation_results)
                  if e['class'] == 'ambiguous']
incorrect_count = sum(1 for e in evaluation_results if e['class'] == 'incorrect')

final_context = []

#3a. 处理CORRECT文档（知识精炼）
if correct_docs:
    for doc in correct_docs:
        refined = decompose_and_recompose(doc, query)
        final_context.append({
            'source': 'internal',
            'content': refined
        })

#3b. 处理AMBIGUOUS文档（保留+网络搜索）
if ambiguous_docs:
    # 保留部分内容
    for doc in ambiguous_docs:
        refined = decompose_and_recompose(doc, query, threshold=0.7)
        final_context.append({
            'source': 'internal_ambiguous',
            'content': refined
        })
    # 补充网络搜索
    web_results = web_search_fallback(query, ambiguous_docs)
    final_context.extend(web_results)

#3c. 处理INCORRECT情况（纯网络搜索）
if incorrect_count >= 3 and not correct_docs:
    # 如果大部分文档不相关，直接网络搜索
    web_results = web_search_fallback(query, retrieved_docs)
    final_context = web_results

#步骤4：生成最终答案
prompt = build_rag_prompt(query, final_context)
answer = llm.invoke(prompt)

#输出示例：
"""
阿司匹林的主要副作用包括：

胃肠道反应（最常见）
胃部不适、恶心
胃溃疡
胃出血

出血倾向
延长出血时间
增加出血风险

过敏反应
皮疹
哮喘（阿司匹林哮喘）

来源：
内部医疗知识库（置信度92%）
网络医学资源补充
"""
CRAG vs 传统RAG vs CRAG对比
image.png

性能对比（基于论文数据）：

测试集：PopQA（流行问题问答）

┌─────────────────┬───────────┬───────────┬─────────────┐
│      方法       │  准确率   │  召回率   │ 幻觉率(%)   │
├─────────────────┼───────────┼───────────┼─────────────┤
│ Vanilla LLM     │   42.3%   │   38.1%   │    28.6%    │
│ Standard RAG    │   56.8%   │   61.2%   │    15.3%    │
│ CRAG            │   71.4%   │   73.9%   │     4.2%    │
└─────────────────┴───────────┴───────────┴─────────────┘

测试集：PubHealth（医疗健康事实验证）

┌─────────────────┬───────────┬───────────┬─────────────┐
│      方法       │  准确率   │   F1     │  精确度     │
├─────────────────┼───────────┼───────────┼─────────────┤
│ Standard RAG    │   68.5%   │   0.672   │    0.681    │
│ CRAG            │   89.2%   │   0.887   │    0.893    │
└─────────────────┴───────────┴───────────┴─────────────┘

关键发现：
CRAG在医疗领域将幻觉率降低到接近0%
准确率提升了25.8个百分点
特别适合高风险领域（医疗、法律、金融）
CRAG的LangChain实现
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

#定义状态
class GraphState(TypedDict):
    query: str
    documents: List[str]
    evaluation: str
    generation: str

#节点1：检索
def retrieve(state):
    query = state["query"]
    documents = vector_store.similarity_search(query, k=5)
    return {"documents": documents, "query": query}

#节点2：评估文档相关性
def grade_documents(state):
    query = state["query"]
    documents = state["documents"]
    # 使用LLM评估
    grader_prompt = ChatPromptTemplate.from_template("""
    评估文档是否与查询相关。
    查询: {query}
    文档: {document}
    返回 'yes' 如果相关，'no' 如果不相关。
    """)
    filtered_docs = []
    for doc in documents:
        grade = grader_prompt | llm
        result = grade.invoke({"query": query, "document": doc})
        if "yes" in result.content.lower():
            filtered_docs.append(doc)
    # 判断是否需要网络搜索
    if len(filtered_docs) == 0:
        return {
            "documents": filtered_docs,
            "query": query,
            "evaluation": "incorrect"
        }
    elif len(filtered_docs) < len(documents) * 0.5:
        return {
            "documents": filtered_docs,
            "query": query,
            "evaluation": "ambiguous"
        }
    else:
        return {
            "documents": filtered_docs,
            "query": query,
            "evaluation": "correct"
        }

#节点3：网络搜索
def web_search(state):
    query = state["query"]
    # 重写查询
    rewrite_prompt = ChatPromptTemplate.from_template("""
    重写以下查询使其更适合网络搜索：
    {query}
    """)
    rewritten = rewrite_prompt | llm
    new_query = rewritten.invoke({"query": query}).content
    # 执行搜索
    tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    results = tavily.search(new_query, max_results=3)
    web_docs = [r['content'] for r in results['results']]
    return {"documents": web_docs, "query": query}

#节点4：生成答案
def generate(state):
    query = state["query"]
    documents = state["documents"]
    # 构建prompt
    context = "\n\n".join(documents)
    rag_prompt = ChatPromptTemplate.from_template("""
    基于以下上下文回答问题：
    上下文:
    {context}
    问题: {question}
    答案:
    """)
    chain = rag_prompt | llm
    generation = chain.invoke({"context": context, "query": query})
    return {"generation": generation.content}

#决策函数
def decide_to_generate(state):
    evaluation = state["evaluation"]
    if evaluation == "correct":
        return "generate"
    elif evaluation == "ambiguous":
        return "web_search"  # 补充网络搜索
    else:  # incorrect
        return "web_search"

#构建图
workflow = StateGraph(GraphState)

#添加节点
workflow.add_node("retrieve", retrieve)
workflow.add_node("grade_documents", grade_documents)
workflow.add_node("web_search", web_search)
workflow.add_node("generate", generate)

#设置入口
workflow.set_entry_point("retrieve")

#添加边
workflow.add_edge("retrieve", "grade_documents")
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {
        "generate": "generate",
        "web_search": "web_search"
    }
)
workflow.add_edge("web_search", "generate")
workflow.add_edge("generate", END)

#编译并运行
app = workflow.compile()

result = app.invoke({"query": "阿司匹林的主要副作用是什么？"})
print(result["generation"])
CRAG的优缺点分析
✅ 优点：
显著降低幻觉
通过质量评估过滤不可靠信息
医疗领域幻觉率从15%降至4%
动态知识补充
检索失败时自动触发网络搜索
保证答案的时效性
内容精炼
分解-重组算法去除冗余
优化LLM输入，提升生成质量
适应性强
根据文档质量自动调整策略
适用于多种领域
❌ 缺点：
复杂度增加

传统RAG：检索 → 生成 (2步)
CRAG：检索 → 评估 → 精炼/搜索 → 生成 (4步)

系统复杂度提升100%
维护成本增加
延迟增加

传统RAG延迟：~500ms
CRAG延迟：~1200ms（增加140%）

主要耗时：
文档评估：200ms
知识精炼：300ms
网络搜索（如触发）：700ms
成本上升

额外API调用：
评估器：每个文档1次LLM调用
查询重写：1次LLM调用
网络搜索：Tavily API费用

总成本增加约60-80%
可扩展性挑战

大规模文档（10K+）时：
评估所有文档耗时长
需要分批处理
可能引入全局不一致
CRAG适用场景
强烈推荐：
🏥 医疗诊断辅助系统
⚖️ 法律文书分析
💰 金融风险评估
🔬 科研论文问答
📰 新闻事实核查
不太适合：
🎨 创意写作
💬 闲聊对话
🎮 娱乐应用
⚡ 超低延迟场景
CRAG实战优化技巧
并行处理评估
from concurrent.futures import ThreadPoolExecutor

def parallel_evaluate(documents, query, max_workers=5):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(
            lambda doc: evaluate_document(query, doc),
            documents
        ))
    return results

#将评估时间从1000ms降至200ms（5个文档）
缓存评估结果
from functools import lru_cache

@lru_cache(maxsize=1000)
def cached_evaluate(query_hash, doc_hash):
    return evaluate_document(query, doc)

#相同查询-文档对无需重复评估
智能阈值调整
def adaptive_threshold(domain, confidence):
    """根据领域调整评估阈值"""
    thresholds = {
        'medical': {'correct': 0.9, 'incorrect': 0.2},
        'general': {'correct': 0.7, 'incorrect': 0.3},
        'creative': {'correct': 0.6, 'incorrect': 0.4}
    }
    return thresholds.get(domain, thresholds['general'])
增量式网络搜索
def incremental_web_search(query, existing_docs, max_searches=3):
    """逐步增加搜索结果，而非一次性搜索大量"""
    results = []
    for i in range(1, max_searches + 1):
        new_results = tavily.search(query, max_results=i)
        if is_sufficient(existing_docs + results, query):
            break
        results.extend(new_results)
    return results
6.4 Self-RAG：自反思检索增强生成
什么是Self-RAG？
Self-RAG的全称是Self-Reflective Retrieval-Augmented Generation（自反思检索增强生成）。如果说CRAG是给RAG加了一个"质检员"，那Self-RAG就是让RAG系统学会了"自我反思"——它能在生成过程中不断问自己："我需要查资料吗？""这个资料靠谱吗？""我生成的内容对吗？"
核心理念：

传统RAG：固定检索 → 生成
CRAG：检索 → 评估 → 纠错 → 生成
Self-RAG：动态决策检索 → 评估检索质量 → 生成 → 评估生成质量 → 循环优化
Self-RAG的三大创新点
按需检索（On-Demand Retrieval）
不是所有查询都需要检索
模型自己决定何时需要外部知识
自我反思（Self-Reflection）
评估检索到的文档是否相关
评估生成的内容是否有事实支持
评估最终答案是否有用
反思令牌（Reflection Tokens）
特殊的token指导模型行为
可在推理时控制模型的检索和生成策略
Self-RAG参考图
来自网络
image.png

反思令牌（Reflection Tokens）详解
Self-RAG通过在词表中添加特殊的反思令牌来控制模型行为。这些令牌分为两大类：
检索令牌（Retrieval Tokens）
Retrieve Token：决定是否需要检索

class RetrieveDecision(Enum):
    YES = "Retrieve=Yes"      # 需要检索
    NO = "Retrieve=No"        # 不需要检索    CONTINUE = "Retrieve=Continue"  # 继续使用之前检索的内容
什么时候生成 [Retrieve=Yes]？
查询涉及事实性信息
需要最新数据
超出模型训练知识范围
什么时候生成 [Retrieve=No]？
创意性任务（写诗、写故事）
常识性问题
数学计算
实际示例：

用户查询1："写一首关于春天的诗"
模型输出：[Retrieve=No] 春风拂面暖如酥...
（不需要检索，直接创作）

用户查询2："2024年诺贝尔物理学奖得主是谁？"
模型输出：[Retrieve=Yes]
（需要检索最新信息）

用户查询3："继续解释刚才提到的量子纠缠"
模型输出：[Retrieve=Continue]
（使用之前检索的文档）
批评令牌（Critique Tokens）
ISREL (Is Relevant)：文档相关性判断

class DocumentRelevance(Enum):
    RELEVANT = "ISREL=Relevant"
    IRRELEVANT = "ISREL=Irrelevant"
ISSUP (Is Supported)：生成内容是否有事实支持

class FactualSupport(Enum):
    FULLY_SUPPORTED = "ISSUP=FullySupported"
    PARTIALLY_SUPPORTED = "ISSUP=PartiallySupported"
    NO_SUPPORT = "ISSUP=NoSupport"
ISUSE (Is Useful)：生成结果是否有用

class ResponseUtility(Enum):
    USEFUL_5 = "ISUSE=5"  # 非常有用
    USEFUL_4 = "ISUSE=4"
    USEFUL_3 = "ISUSE=3"
    USEFUL_2 = "ISUSE=2"
    USEFUL_1 = "ISUSE=1"  # 完全无用
Self-RAG vs CRAG vs 传统RAG对比
image.png

详细对比表：

┌─────────────────────┬──────────────┬─────────────┬──────────────┐
│        特性         │  传统RAG     │    CRAG     │   Self-RAG   │
├─────────────────────┼──────────────┼─────────────┼──────────────┤
│ 是否总是检索        │     是       │     是      │      否      │
│ 评估检索质量        │     否       │     是      │      是      │
│ 评估生成质量        │     否       │     否      │      是      │
│ 动态调整策略        │     否       │    部分     │      是      │
│ 支持迭代优化        │     否       │    有限     │      是      │
│ 模型可控性          │     低       │     中      │      高      │
│ 系统复杂度          │     低       │     中      │      高      │
│ 训练成本            │    无需      │    低       │      高      │
│ 推理延迟            │    快        │     中      │     慢       │
│ 准确率              │    中等      │     高      │     最高     │
└─────────────────────┴──────────────┴─────────────┴──────────────┘
性能对比（基于论文实验）：

测试集：PopQA（开放域问答）

┌──────────────┬────────────┬────────────┬────────────┐
│    方法      │  准确率    │   F1 Score │  延迟(ms)  │
├──────────────┼────────────┼────────────┼────────────┤
│ Llama2-7B    │   31.2%    │    0.289   │    120     │
│ RAG          │   49.3%    │    0.467   │    450     │
│ CRAG         │   58.7%    │    0.556   │    980     │
│ Self-RAG-7B  │   64.1%    │    0.618   │   1200     │
│ ChatGPT      │   52.4%    │    0.501   │    800     │
│ Self-RAG-13B │   68.9%    │    0.662   │   1450     │
└──────────────┴────────────┴────────────┴────────────┘

测试集：PubHealth（事实验证）

┌──────────────┬────────────┬────────────┬────────────┐
│    方法      │  准确率    │  Precision │   Recall   │
├──────────────┼────────────┼────────────┼────────────┤
│ RAG          │   78.3%    │    0.761   │   0.792    │
│ CRAG         │   85.6%    │    0.841   │   0.869    │
│ Self-RAG-7B  │   88.2%    │    0.876   │   0.891    │
│ Self-RAG-13B │   91.4%    │    0.908   │   0.919    │
└──────────────┴────────────┴────────────┴────────────┘
Self-RAG的推理时控制
Self-RAG最强大的特性之一是推理时可控性——你可以通过调整参数来控制模型行为，而无需重新训练！
调整检索频率

#配置：更激进的检索
config_aggressive = {
    'retrieve_threshold': 0.3,  # 更低的阈值 = 更频繁检索
    'retrieve_frequency': 'every_sentence'  # 每句话都评估是否需要检索
}

#配置：保守的检索
config_conservative = {
    'retrieve_threshold': 0.7,  # 更高的阈值 = 较少检索
    'retrieve_frequency': 'on_demand'  # 仅在必要时检索
}

#配置：平衡模式
config_balanced = {
    'retrieve_threshold': 0.5,
    'retrieve_frequency': 'adaptive'  # 根据查询复杂度动态调整
}
段级束搜索（Segment-wise Beam Search）
Self-RAG使用特殊的束搜索策略，在生成每个段（sentence）时考虑反思令牌的影响。
def segment_wise_beam_search(
    query,
    model,
    retriever,
    beam_width=5,
    preference_weights={
        'relevance': 1.0,
        'support': 1.5,
        'utility': 2.0
    }
):
    """
    段级束搜索，优化多个维度
    """
    candidates = [{'text': '', 'score': 0.0, 'path': []}]
    while not all_candidates_finished(candidates):
        new_candidates = []
        for candidate in candidates:
            # 生成下一个段
            next_segments = model.generate_next_segments(
                query,
                candidate['text'],
                num_candidates=beam_width
            )
            for segment, tokens in next_segments:
                # 计算综合分数
                score = 0.0
                # 检索令牌权重
                if '[Retrieve=Yes]' in tokens:
                    docs = retriever.get_relevant_documents(query)
                    relevance_score = evaluate_relevance(docs)
                    score += preference_weights['relevance'] * relevance_score
                # 支持度权重
                if '[ISSUP' in tokens:
                    support_level = extract_support_level(tokens)
                    score += preference_weights['support'] * support_level
                # 有用性权重
                if '[ISUSE' in tokens:
                    utility_score = extract_utility_score(tokens)
                    score += preference_weights['utility'] * utility_score
                new_candidates.append({
                    'text': candidate['text'] + segment,
                    'score': candidate['score'] + score,
                    'path': candidate['path'] + [tokens]
                })
        # 保留top-k候选
        candidates = sorted(
            new_candidates,
            key=lambda x: x['score'],
            reverse=True
        )[:beam_width]
    return candidates[0]  # 返回得分最高的候选
实际效果示例：

查询："介绍一下量子计算的最新进展"

偏好1：注重事实支持
preference_weights = {
    'relevance': 1.0,
    'support': 3.0,    # 大幅提升支持度权重
    'utility': 1.0
}

输出：
"量子计算在2024年取得了重大突破。[Retrieve=Yes]
根据Nature期刊2024年3月的报道，IBM宣布其127量子比特的Eagle处理器... [ISSUP=FullySupported]
Google也在量子纠错方面取得进展... [ISSUP=FullySupported]"

偏好2：注重实用性
preference_weights = {
    'relevance': 1.0,
    'support': 1.0,
    'utility': 3.0     # 大幅提升实用性权重
}

输出：
"量子计算正在改变多个行业。[Retrieve=No]
在药物发现领域，量子计算可以模拟分子相互作用...
在金融领域，可以优化投资组合...
在密码学领域，既是机遇也是挑战..."


Self-RAG的LangGraph实现
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from typing import TypedDict, Annotated, Sequence
import operator

#定义状态
class GraphState(TypedDict):
    query: str
    documents: Sequence[str]
    generation: str
    need_retrieve: bool
    doc_relevance: Sequence[bool]
    factual_support: str
    utility_score: int
    loop_count: int

#节点1：决定是否检索
def decide_to_retrieve(state):
    """判断查询是否需要检索"""
    query = state["query"]
    # 使用LLM判断
    prompt = f"""
    判断以下查询是否需要检索外部知识：
    查询：{query}
    如果查询涉及：
    - 最新信息或事实
    - 超出常识的专业知识
    - 需要引用来源
    则返回 "yes"
    如果查询涉及：
    - 创意写作
    - 常识问题
    - 简单计算
    则返回 "no"
    只返回 yes 或 no。
    """
    llm = ChatOpenAI(model="gpt-4", temperature=0)
    result = llm.invoke(prompt).content.lower()
    return {"need_retrieve": "yes" in result, "loop_count": 0}

#节点2：检索文档
def retrieve(state):
    """执行检索"""
    query = state["query"]
    documents = vectorstore.similarity_search(query, k=5)
    return {"documents": documents}

#节点3：评估文档相关性
def grade_documents(state):
    """评估每个文档的相关性"""
    query = state["query"]
    documents = state["documents"]
    relevance = []
    filtered_docs = []
    for doc in documents:
        prompt = f"""
        评估文档是否与查询相关：
        查询：{query}
        文档：{doc.page_content[:500]}
        如果文档包含回答查询所需的信息，返回 "relevant"
        否则返回 "irrelevant"
        """
        llm = ChatOpenAI(model="gpt-4", temperature=0)
        result = llm.invoke(prompt).content.lower()
        is_relevant = "relevant" in result
        relevance.append(is_relevant)
        if is_relevant:
            filtered_docs.append(doc)
    return {
        "doc_relevance": relevance,
        "documents": filtered_docs
    }

#节点4：生成答案
def generate(state):
    """生成答案"""
    query = state["query"]
    documents = state["documents"]
    need_retrieve = state.get("need_retrieve", True)
    if need_retrieve and documents:
        # 基于文档生成
        context = "\n\n".join([doc.page_content for doc in documents])
        prompt = f"""
        基于以下上下文回答问题：
        上下文：{context}
        问题：{query}
        答案：
        """
    else:
        # 直接生成
        prompt = f"""
        回答以下问题：
        问题：{query}
        答案：
        """
    llm = ChatOpenAI(model="gpt-4", temperature=0.7)
    generation = llm.invoke(prompt).content
    return {"generation": generation}

#节点5：评估事实支持度
def grade_generation_factual_support(state):
    """评估生成内容是否有事实支持"""
    generation = state["generation"]
    documents = state["documents"]
    if not documents:
        return {"factual_support": "no_docs"}
    context = "\n\n".join([doc.page_content for doc in documents])
    prompt = f"""
    评估生成的答案是否有文档支持：
    文档：
    {context}

    生成的答案：
    {generation}

    请评估答案中的每个事实陈述：
    - 如果所有陈述都有文档支持，返回 "fully_supported"
    - 如果部分陈述有支持，返回 "partially_supported"
    - 如果没有支持或有明显错误，返回 "not_supported"
    """
    llm = ChatOpenAI(model="gpt-4", temperature=0)
    result = llm.invoke(prompt).content.lower()
    if "fully_supported" in result:
        support = "fully_supported"
    elif "partially_supported" in result:
        support = "partially_supported"
    else:
        support = "not_supported"
    return {"factual_support": support}

#节点6：评估答案有用性
def grade_generation_utility(state):
    """评估答案的有用性"""
    query = state["query"]
    generation = state["generation"]
    prompt = f"""
    评估答案对查询的有用性（1-5分）：
    查询：{query}
    答案：{generation}
    评分标准：
    5 - 完美回答，清晰、准确、全面
    4 - 很好回答，略有不足
    3 - 可以接受，但有明显缺陷
    2 - 较差，大部分无用
    1 - 完全无用
    只返回数字1-5。
    """
    llm = ChatOpenAI(model="gpt-4", temperature=0)
    result = llm.invoke(prompt).content.strip()
    try:
        score = int(result[0])
    except:
        score = 3  # 默认分数
    return {"utility_score": score}

#决策函数
def decide_to_generate(state):
    """决定是生成还是网络搜索"""
    need_retrieve = state["need_retrieve"]
    if need_retrieve:
        return "retrieve"
    else:
        return "generate"

def check_doc_relevance(state):
    """检查文档相关性"""
    doc_relevance = state.get("doc_relevance", [])
    if any(doc_relevance):
        return "generate"
    else:
        return "web_search"

def check_factual_support(state):
    """检查事实支持度"""
    factual_support = state["factual_support"]
    if factual_support == "fully_supported":
        return "grade_utility"
    else:
        return "regenerate"

def check_utility(state):
    """检查有用性"""
    utility_score = state["utility_score"]
    loop_count = state["loop_count"]
    if utility_score >= 4:
        return "end"
    elif loop_count < 2:
        return "retry"
    else:
        return "end"  # 最多重试2次

#构建图
workflow = StateGraph(GraphState)

#添加节点
workflow.add_node("decide_retrieve", decide_to_retrieve)
workflow.add_node("retrieve", retrieve)
workflow.add_node("grade_documents", grade_documents)
workflow.add_node("generate", generate)
workflow.add_node("grade_support", grade_generation_factual_support)
workflow.add_node("grade_utility", grade_generation_utility)

#设置入口
workflow.set_entry_point("decide_retrieve")

#添加边
workflow.add_conditional_edges(
    "decide_retrieve",
    decide_to_generate,
    {
        "retrieve": "retrieve",
        "generate": "generate"
    }
)

workflow.add_edge("retrieve", "grade_documents")

workflow.add_conditional_edges(
    "grade_documents",
    check_doc_relevance,
    {
        "generate": "generate",
        "web_search": "retrieve"  # 简化：重新检索
    }
)

workflow.add_edge("generate", "grade_support")

workflow.add_conditional_edges(
    "grade_support",
    check_factual_support,
    {
        "grade_utility": "grade_utility",
        "regenerate": "generate"
    }
)

workflow.add_conditional_edges(
    "grade_utility",
    check_utility,
    {
        "end": END,
        "retry": "retrieve"
    }
)

#编译
app = workflow.compile()

#执行
result = app.invoke({
    "query": "什么是Self-RAG？",
    "documents": [],
    "generation": "",
    "need_retrieve": True,
    "doc_relevance": [],
    "factual_support": "",
    "utility_score": 0,
    "loop_count": 0
})

print(result["generation"])
Self-RAG的优缺点
✅ 优点：
最高准确率

在多个benchmark上超越ChatGPT和其他RAG方法
事实准确率提升20-30%
按需检索

不是所有查询都检索 → 节省成本和时间
创意任务：0次检索
事实查询：1-3次检索
推理时可控

无需重新训练即可调整行为
根据不同应用场景调整偏好权重
多维度评估

同时考虑：相关性、支持度、有用性
全面保证答案质量
自我纠错能力

检测到答案不佳时自动重试
迭代优化直到满意
❌ 缺点：
训练成本极高

需要两阶段训练：Critic Model训练 + Generator Model训练
数据需求：10-15万条高质量样本
GPU需求：A100 × 8，训练时间2-3周
总成本：$50,000 - $100,000
推理速度最慢

每个段都需要多次评估
复杂查询可能检索多次

平均延迟：
传统RAG: 500ms
CRAG: 1000ms
Self-RAG: 1500ms
系统复杂度最高

需要维护：Generator模型 + Critic模型 + 检索系统 + 束搜索逻辑
调试和优化难度大
模型大小限制

目前只有7B和13B的开源模型
更大模型（70B+）训练成本过高
token开销大

反思令牌占用额外空间
例如："Retrieve=Yes ISREL=Relevant ISSUP=FullySupported"
增加10-15%的token使用
Self-RAG适用场景
强烈推荐：
🎓 教育和研究助手
📚 学术论文问答
💼 企业知识库（预算充足）
🏥 医疗文献检索
⚖️ 法律案例分析
不适合：
🚀 实时对话系统（延迟要求<500ms）
📱 移动端应用（模型太大）
💸 预算有限的项目（训练/推理成本高）
🎨 创意类应用（过度检索可能限制创造力）



image.png

RAG系统最头疼的3大难题
🔥 难题1：检索不准确（最核心的痛点）
问题描述：
你问"苹果的营养价值"，系统却返回"苹果公司的股价"
检索结果偏差，导致生成的答案驴唇不对马嘴
image.png

为什么会这样？
语义理解不足

# 问题：同一个词，不同含义
query1 = "苹果好吃吗？"          # 指水果
query2 = "苹果股票怎么样？"       # 指公司

# 如果向量模型不够好，可能会混淆
分块策略不当

# ❌ 错误的切分
chunk1 = "我们的产品销售额在2023年"
chunk2 = "达到了5000万元，增长..."
# 用户查询："2023年销售额"
# 结果：chunk1被检索到，但信息不完整！

# ✅ 正确的切分（保持上下文完整）
chunk = "我们的产品销售额在2023年达到了5000万元，增长25%"
向量检索的局限性

# 纯向量检索的问题
query = "2023年10月15日的会议记录"

# 向量相似度可能检索到：
# - "2023年10月16日的会议记录" ✓ （相似但不对）
# - "2023年9月的会议总结"     ✓ （相似但不对）
# - "2023年10月15日的会议记录" ✓✓✓ （精确匹配）
解决方案：混合检索
from langchain.retrievers import EnsembleRetriever
from langchain.retrievers import BM25Retriever

# 方案1：向量检索（语义相似）
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# 方案2：BM25检索（关键词匹配）
bm25_retriever = BM25Retriever.from_texts(chunks)
bm25_retriever.k = 5

# 混合检索：结合两种方法的优点
ensemble_retriever = EnsembleRetriever(
    retrievers=[vector_retriever, bm25_retriever],
    weights=[0.6, 0.4]  # 向量60%权重，BM25 40%权重
)

# 检索效果对比
query = "2023年10月15日的销售数据"
results = ensemble_retriever.get_relevant_documents(query)
进阶方案：重排序（Reranking）
from sentence_transformers import CrossEncoder

# 第一步：粗筛（检索Top 20）
initial_docs = vectorstore.similarity_search(query, k=20)

# 第二步：精排（用更强的模型打分）
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# 计算每个文档与query的相关性分数
scores = reranker.predict([(query, doc.page_content) for doc in initial_docs])

# 按分数排序，取Top 3
sorted_docs = [doc for _, doc in sorted(zip(scores, initial_docs), reverse=True)]
final_docs = sorted_docs[:3]

🔥 难题2：上下文窗口限制
问题描述：
检索到10篇相关文档，但AI一次只能看3篇
有用的信息可能在第7篇，AI看不到
https://claude.zhangsan.shop/chat/context_window_limit.svg
解决方案：智能压缩
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain.retrievers import ContextualCompressionRetriever

# 创建压缩器
compressor = LLMChainExtractor.from_llm(llm)

# 压缩检索器
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vector_retriever
)

# 使用示例
query = "2023年销售额"
compressed_docs = compression_retriever.get_relevant_documents(query)

# 对比：
# 原始文档：5000字 → 压缩后：500字（只保留与query相关的部分）

🔥 难题3：如何评估RAG效果（没有标准答案）
问题描述：
生成的答案看起来不错，但真的对吗？
不同的RAG配置，哪个更好？
这就引出了下一个核心话题... 看另一个文档

🔥 难题4：文档，表格怎么解析，这个我们到时候重新更新一篇文章解析

评估RAG：如何知道你的系统靠不靠谱？
📊 评估体系全景图
image.png

🎯 评估维度1：检索质量
指标1：召回率（Recall）
通俗解释：该找到的文档，你找到了多少？

# 示例场景
真实相关文档 = [doc1, doc2, doc3, doc4, doc5]  # 5个相关文档
系统检索结果 = [doc1, doc2, doc6]             # 检索到3个，其中2个正确

召回率 = 检索到的正确文档数 / 总的相关文档数
      = 2 / 5
      = 0.4 (40%)
代码实现：
def calculate_recall(retrieved_docs, relevant_docs):
    """
    计算召回率

    Args:
        retrieved_docs: 系统检索到的文档ID列表
        relevant_docs: 真实相关的文档ID列表
    """
    retrieved_set = set(retrieved_docs)
    relevant_set = set(relevant_docs)

    # 检索到的正确文档
    correct = retrieved_set.intersection(relevant_set)

    recall = len(correct) / len(relevant_set) if relevant_set else 0

    return recall

# 测试
retrieved = ['doc1', 'doc2', 'doc6']
relevant = ['doc1', 'doc2', 'doc3', 'doc4', 'doc5']

print(f"召回率: {calculate_recall(retrieved, relevant):.2%}")  # 40%
指标2：准确率（Precision）
通俗解释：检索到的文档中，有多少是真正相关的？

准确率 = 检索到的正确文档数 / 检索到的总文档数
      = 2 / 3
      = 0.67 (67%)
指标3：MRR（Mean Reciprocal Rank）
通俗解释：第一个正确答案排在第几位？

# 场景1：第一个就是正确答案
检索结果 = [doc1✓, doc2, doc3]
MRR = 1/1 = 1.0

# 场景2：第三个才是正确答案
检索结果 = [doc5, doc7, doc1✓]
MRR = 1/3 = 0.33

# 场景3：没有正确答案
检索结果 = [doc5, doc7, doc9]
MRR = 0
代码实现：
def calculate_mrr(retrieved_docs, relevant_docs):
    """计算MRR"""
    for i, doc in enumerate(retrieved_docs, 1):
        if doc in relevant_docs:
            return 1.0 / i
    return 0.0

# 测试
retrieved = ['doc5', 'doc7', 'doc1']
relevant = ['doc1', 'doc2']

print(f"MRR: {calculate_mrr(retrieved, relevant):.3f}")  # 0.333
🎯 评估维度2：生成质量
指标1：事实准确性
人工评估标准：

评分标准 = {
    5: "完全正确，信息准确",
    4: "基本正确，有小瑕疵",
    3: "部分正确",
    2: "大部分错误",
    1: "完全错误"
}
自动评估（使用LLM评分）：
from langchain.evaluation import load_evaluator

# 创建评估器
evaluator = load_evaluator("labeled_criteria", criteria="correctness")

# 评估示例
eval_result = evaluator.evaluate_strings(
    prediction="2023年Q4销售额为5000万元",  # AI生成的答案
    reference="根据财报，2023年Q4销售额为5000万元",  # 标准答案
    input="2023年Q4销售额是多少？"  # 原始问题
)

print(f"准确性得分: {eval_result['score']}")
print(f"评估理由: {eval_result['reasoning']}")
指标2：忠实度（Faithfulness）
通俗解释：生成的答案是否忠于检索到的文档？有没有瞎编？

# ❌ 低忠实度示例
检索文档: "2023年Q4销售额为5000万元"
AI回答: "2023年Q4销售额为5000万元，预计2024年将达到8000万元"
问题: 后半句是AI瞎编的！

# ✅ 高忠实度示例
检索文档: "2023年Q4销售额为5000万元"
AI回答: "根据财报，2023年Q4销售额为5000万元"
代码评估：
def evaluate_faithfulness(generated_answer, retrieved_docs, llm):
    """
    评估答案忠实度
    """
    prompt = f"""
    检索到的文档：
    {retrieved_docs}

    生成的答案：
    {generated_answer}

    请评估：生成的答案中的信息是否都能在检索文档中找到依据？
    评分：1-5分（5分=完全忠实，1分=大量虚构）

    输出格式：
    得分: X/5
    理由: ...
    """

    result = llm.predict(prompt)
    return result

# 使用示例
docs = "2023年Q4销售额为5000万元，同比增长25%"
answer = "2023年Q4销售额为5000万元，预计2024年将达到8000万元"

faithfulness_score = evaluate_faithfulness(answer, docs, llm)
print(faithfulness_score)
指标3：相关性（Relevance）
通俗解释：回答是否切题？

# 用户问题
query = "如何提高团队效率？"

# ❌ 低相关性
answer = "团队建设很重要，沟通是关键..."  # 太泛泛

# ✅ 高相关性
answer = "提高团队效率的3个方法：1)使用敏捷开发 2)每日站会 3)OKR目标管理"
🎯 评估维度3：端到端评估
使用RAGAS框架
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_relevancy,
    context_recall
)

# 准备评估数据
eval_data = {
    "question": ["2023年Q4销售额是多少？", "产品有哪些核心功能？"],
    "answer": ["5000万元", "包括AI助手、数据分析、自动化流程"],
    "contexts": [
        ["2023年Q4销售额为5000万元，同比增长25%"],
        ["核心功能包括：AI智能助手、实时数据分析、工作流自动化"]
    ],
    "ground_truths": ["5000万元", "AI助手、数据分析、自动化"]
}

# 执行评估
result = evaluate(
    eval_data,
    metrics=[
        faithfulness,        # 忠实度
        answer_relevancy,    # 答案相关性
        context_relevancy,   # 上下文相关性
        context_recall       # 上下文召回
    ]
)

# 查看结果
print(result)
# 输出示例：
# {
#   'faithfulness': 0.95,
#   'answer_relevancy': 0.92,
#   'context_relevancy': 0.88,
#   'context_recall': 0.90
# }
📈 完整评估流程

class RAGEvaluator:
    """RAG系统评估器"""

    def __init__(self, rag_system, test_dataset):
        self.rag_system = rag_system
        self.test_dataset = test_dataset  # 测试数据集

    def evaluate_retrieval(self):
        """评估检索效果"""
        recalls = []
        precisions = []
        mrrs = []

        for test_case in self.test_dataset:
            query = test_case['query']
            relevant_docs = test_case['relevant_docs']

            # 执行检索
            retrieved_docs = self.rag_system.retrieve(query, k=5)

            # 计算指标
            recall = self._calculate_recall(retrieved_docs, relevant_docs)
            precision = self._calculate_precision(retrieved_docs, relevant_docs)
            mrr = self._calculate_mrr(retrieved_docs, relevant_docs)

            recalls.append(recall)
            precisions.append(precision)
            mrrs.append(mrr)

        return {
            'avg_recall': sum(recalls) / len(recalls),
            'avg_precision': sum(precisions) / len(precisions),
            'avg_mrr': sum(mrrs) / len(mrrs)
        }

    def evaluate_generation(self):
        """评估生成效果"""
        faithfulness_scores = []
        relevancy_scores = []

        for test_case in self.test_dataset:
            query = test_case['query']
            ground_truth = test_case['answer']

            # 执行RAG
            answer, contexts = self.rag_system.query(query)

            # 评估
            faith_score = self._evaluate_faithfulness(answer, contexts)
            rel_score = self._evaluate_relevancy(answer, query)

            faithfulness_scores.append(faith_score)
            relevancy_scores.append(rel_score)

        return {
            'avg_faithfulness': sum(faithfulness_scores) / len(faithfulness_scores),
            'avg_relevancy': sum(relevancy_scores) / len(relevancy_scores)
        }

    def run_full_evaluation(self):
        """运行完整评估"""
        retrieval_metrics = self.evaluate_retrieval()
        generation_metrics = self.evaluate_generation()

        print("=" * 50)
        print("RAG系统评估报告")
        print("=" * 50)
        print("\n📊 检索效果:")
        print(f"  召回率: {retrieval_metrics['avg_recall']:.2%}")
        print(f"  准确率: {retrieval_metrics['avg_precision']:.2%}")
        print(f"  MRR: {retrieval_metrics['avg_mrr']:.3f}")
        print("\n📝 生成效果:")
        print(f"  忠实度: {generation_metrics['avg_faithfulness']:.2%}")
        print(f"  相关性: {generation_metrics['avg_relevancy']:.2%}")
        print("=" * 50)

        return {**retrieval_metrics, **generation_metrics}

# 使用示例
test_data = [
    {
        'query': '2023年Q4销售额是多少？',
        'relevant_docs': ['doc1', 'doc3'],
        'answer': '5000万元'
    },
    # ... 更多测试用例
]

evaluator = RAGEvaluator(rag_system, test_data)
results = evaluator.run_full_evaluation()

实战代码：手把手搭建你的第一个RAG
🛠️ 完整代码实现

"""
完整的RAG系统实现
支持：文档加载、向量化、检索、生成
"""

import os
from typing import List, Dict
from langchain.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

class SimpleRAG:
    """简单的RAG系统"""

    def __init__(self,
                 embedding_model: str = "paraphrase-multilingual-MiniLM-L12-v2",
                 llm_model: str = "gpt-3.5-turbo",
                 chunk_size: int = 500,
                 chunk_overlap: int = 50):
        """
        初始化RAG系统

        Args:
            embedding_model: 向量化模型名称
            llm_model: 大语言模型名称
            chunk_size: 文本块大小
            chunk_overlap: 文本块重叠大小
        """
        print("🚀 初始化RAG系统...")

        # 1. 初始化文本分割器
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", "。", "！", "？", " ", ""]
        )

        # 2. 初始化向量化模型
        print(f"📦 加载向量化模型: {embedding_model}")
        self.embeddings = HuggingFaceEmbeddings(
            model_name=embedding_model,
            model_kwargs={'device': 'cpu'}
        )

        # 3. 初始化LLM
        print(f"🤖 加载大语言模型: {llm_model}")
        self.llm = ChatOpenAI(
            model_name=llm_model,
            temperature=0.1  # 降低随机性，提高准确性
        )

        # 4. 向量数据库
        self.vectorstore = None
        self.qa_chain = None

        print("✅ RAG系统初始化完成！\n")

    def load_documents(self, file_paths: List[str]) -> List[str]:
        """
        加载文档

        Args:
            file_paths: 文件路径列表

        Returns:
            文档内容列表
        """
        print("📂 开始加载文档...")
        all_docs = []

        for file_path in file_paths:
            print(f"  - 加载: {file_path}")

            # 根据文件类型选择加载器
            if file_path.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
            else:
                loader = TextLoader(file_path, encoding='utf-8')

            docs = loader.load()
            all_docs.extend(docs)

        print(f"✅ 成功加载 {len(all_docs)} 个文档\n")
        return all_docs

    def build_knowledge_base(self, documents: List[str]):
        """
        构建知识库

        Args:
            documents: 文档列表
        """
        print("🔨 开始构建知识库...")

        # 1. 文档切分
        print("  1️⃣ 切分文档...")
        chunks = self.text_splitter.split_documents(documents)
        print(f"     切分为 {len(chunks)} 个文本块")

        # 2. 向量化并存储
        print("  2️⃣ 向量化并存储到数据库...")
        self.vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory="./chroma_db"
        )
        print(f"     ✅ 已存储到向量数据库")

        # 3. 创建检索QA链
        print("  3️⃣ 创建问答链...")
        self._create_qa_chain()

        print("✅ 知识库构建完成！\n")

    def _create_qa_chain(self):
        """创建问答链"""
        # 自定义提示模板
        template = """你是一个专业的AI助手。请基于以下检索到的上下文信息来回答问题。

【重要规则】
1. 只使用提供的上下文信息回答
2. 如果上下文中没有相关信息，明确说"根据提供的信息无法回答"
3. 回答要准确、简洁
4. 如果可能，引用具体的数据或事实

上下文信息：
{context}

问题: {question}

答案:"""

        prompt = PromptTemplate(
            template=template,
            input_variables=["context", "question"]
        )

        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",  # 将所有文档一次性传给LLM
            retriever=self.vectorstore.as_retriever(
                search_kwargs={"k": 3}  # 检索Top 3相关文档
            ),
            chain_type_kwargs={"prompt": prompt},
            return_source_documents=True  # 返回源文档
        )

    def query(self, question: str) -> Dict:
        """
        查询问题

        Args:
            question: 用户问题

        Returns:
            包含答案和来源文档的字典
        """
        if not self.qa_chain:
            raise ValueError("请先构建知识库！")

        print(f"🔍 查询: {question}")
        print("-" * 50)

        # 执行查询
        result = self.qa_chain({"query": question})

        # 提取答案和来源
        answer = result['result']
        source_docs = result['source_documents']

        print(f"\n💡 答案:\n{answer}\n")
        print(f"📚 来源文档 ({len(source_docs)}个):")
        for i, doc in enumerate(source_docs, 1):
            print(f"  [{i}] {doc.page_content[:100]}...")
        print("-" * 50 + "\n")

        return {
            'answer': answer,
            'sources': [doc.page_content for doc in source_docs]
        }

    def search_similar(self, query: str, k: int = 5) -> List[Dict]:
        """
        搜索相似文档

        Args:
            query: 查询文本
            k: 返回数量

        Returns:
            相似文档列表
        """
        if not self.vectorstore:
            raise ValueError("请先构建知识库！")

        results = self.vectorstore.similarity_search_with_score(query, k=k)

        print(f"🔍 搜索: {query}")
        print(f"📊 找到 {len(results)} 个相关文档:\n")

        similar_docs = []
        for i, (doc, score) in enumerate(results, 1):
            print(f"  [{i}] 相似度: {score:.3f}")
            print(f"      内容: {doc.page_content[:100]}...\n")
            similar_docs.append({
                'content': doc.page_content,
                'score': float(score)
            })

        return similar_docs


# ==================== 使用示例 ====================

def main():
    """主函数：演示RAG系统的完整使用流程"""

    # 1. 创建RAG系统
    rag = SimpleRAG(
        embedding_model="paraphrase-multilingual-MiniLM-L12-v2",
        llm_model="gpt-3.5-turbo",
        chunk_size=500,
        chunk_overlap=50
    )

    # 2. 准备测试文档
    print("📝 创建测试文档...")

    # 创建示例文档
    with open("company_report.txt", "w", encoding="utf-8") as f:
        f.write("""
2023年度公司财务报告

一、业绩概况
2023年全年，公司实现营业收入2.5亿元，同比增长35%。
其中，第四季度单季度营收达到5000万元，创历史新高。

二、产品线表现
- AI助手产品：年销售额1.2亿元，占比48%
- 数据分析平台：年销售额8000万元，占比32%
- 企业服务：年销售额5000万元，占比20%

三、市场展望
预计2024年公司营收将突破3亿元，继续保持高速增长态势。
        """)

    with open("product_manual.txt", "w", encoding="utf-8") as f:
        f.write("""
产品使用手册

产品名称：智能AI助手
版本：v2.0

核心功能：
1. 自然语言对话：支持多轮对话，理解上下文
2. 知识问答：基于企业知识库回答问题
3. 任务自动化：自动执行重复性任务
4. 数据分析：实时分析业务数据

使用场景：
- 客户服务：24小时在线客服
- 内部协作：团队知识管理
- 业务分析：销售数据洞察
        """)

    # 3. 加载文档
    documents = rag.load_documents([
        "company_report.txt",
        "product_manual.txt"
    ])

    # 4. 构建知识库
    rag.build_knowledge_base(documents)

    # 5. 测试查询
    print("=" * 70)
    print("开始测试查询")
    print("=" * 70 + "\n")

    # 测试1：财务问题
    rag.query("2023年第四季度的营收是多少？")

    # 测试2：产品问题
    rag.query("AI助手有哪些核心功能？")

    # 测试3：搜索相似文档
    rag.search_similar("产品功能介绍", k=3)

    print("✅ 测试完成！")


if __name__ == "__main__":
    main()
🎯 运行效果示例

🚀 初始化RAG系统...
📦 加载向量化模型: paraphrase-multilingual-MiniLM-L12-v2
🤖 加载大语言模型: gpt-3.5-turbo
✅ RAG系统初始化完成！

📂 开始加载文档...
  - 加载: company_report.txt
  - 加载: product_manual.txt
✅ 成功加载 2 个文档

🔨 开始构建知识库...
  1️⃣ 切分文档...
     切分为 8 个文本块
  2️⃣ 向量化并存储到数据库...
     ✅ 已存储到向量数据库
  3️⃣ 创建问答链...
✅ 知识库构建完成！

======================================================================
开始测试查询
======================================================================

🔍 查询: 2023年第四季度的营收是多少？
--------------------------------------------------

💡 答案:
根据2023年度公司财务报告，2023年第四季度的营收达到5000万元，创历史新高。

📚 来源文档 (3个):
  [1] 一、业绩概况
2023年全年，公司实现营业收入2.5亿元，同比增长35%。
其中，第四季度单季度营收达到5000万元，创历史新高...
  [2] 三、市场展望
预计2024年公司营收将突破3亿元，继续保持高速增长态势...
  [3] 二、产品线表现
- AI助手产品：年销售额1.2亿元，占比48%...
--------------------------------------------------

进阶技巧：让你的RAG系统脱颖而出
🚀 技巧1：多路召回策略

class AdvancedRetriever:
    """高级检索器：结合多种检索方法"""

    def __init__(self, vectorstore, bm25_index, reranker):
        self.vectorstore = vectorstore
        self.bm25_index = bm25_index
        self.reranker = reranker

    def retrieve(self, query: str, k: int = 5) -> List[str]:
        """多路召回 + 重排序"""

        # 路径1：向量检索（Top 20）
        vector_docs = self.vectorstore.similarity_search(query, k=20)

        # 路径2：BM25关键词检索（Top 20）
        bm25_docs = self.bm25_index.search(query, k=20)

        # 路径3：混合检索（去重）
        all_docs = list(set(vector_docs + bm25_docs))

        # 重排序：用更强的模型打分
        reranked_docs = self.reranker.rerank(query, all_docs)

        # 返回Top K
        return reranked_docs[:k]
🚀 技巧2：查询改写
def query_rewrite(original_query: str, llm) -> List[str]:
    """
    查询改写：生成多个变体查询
    """
    prompt = f"""
    原始查询: {original_query}

    请生成3个语义相同但表达不同的查询变体，用于提高检索召回率。

    输出格式（每行一个）：
    1. ...
    2. ...
    3. ...
    """

    response = llm.predict(prompt)
    variants = [line.strip() for line in response.split('\n') if line.strip()]

    return [original_query] + variants

# 使用示例
query = "公司去年赚了多少钱？"
variants = query_rewrite(query, llm)
# 输出：
# ['公司去年赚了多少钱？',
#  '2023年公司的营收是多少？',
#  '去年公司财务表现如何？',
#  '上一年度的销售额统计']

# 用所有变体检索，合并结果
all_results = []
for q in variants:
    results = vectorstore.similarity_search(q, k=5)
    all_results.extend(results)

# 去重并重排序
final_results = rerank(all_results)
🚀 技巧3：分层检索

class HierarchicalRAG:
    """分层RAG：先粗筛，再精筛"""

    def retrieve(self, query: str):
        # 第1层：快速粗筛（Top 100）
        coarse_results = self.fast_retriever.search(query, k=100)

        # 第2层：精细重排（Top 20）
        fine_results = self.reranker.rerank(query, coarse_results, k=20)

        # 第3层：LLM筛选（Top 5）
        final_results = self.llm_filter(query, fine_results, k=5)

        return final_results
🚀 技巧4：实时更新知识库

class IncrementalRAG:
    """支持增量更新的RAG"""

    def add_document(self, new_doc: str):
        """添加新文档"""
        # 切分
        chunks = self.text_splitter.split_text(new_doc)

        # 向量化
        vectors = self.embeddings.embed_documents(chunks)

        # 增量添加到向量库（不需要重建整个库）
        self.vectorstore.add_texts(chunks, vectors)

        print(f"✅ 已添加 {len(chunks)} 个新文档块")

    def update_document(self, doc_id: str, new_content: str):
        """更新文档"""
        # 删除旧版本
        self.vectorstore.delete(doc_id)

        # 添加新版本
        self.add_document(new_content)