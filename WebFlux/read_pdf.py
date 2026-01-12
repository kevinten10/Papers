#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PDF内容读取脚本
用于提取WebFlux目录下PDF文件的内容
"""

import os
import PyPDF2
import sys

def read_pdf_content(filename, max_pages=5):
    """读取PDF文件内容"""
    try:
        print(f"\n{'='*60}")
        print(f"正在读取: {filename}")
        print(f"{'='*60}")

        pdf = PyPDF2.PdfReader(filename)
        print(f"页数: {len(pdf.pages)}")

        # 读取前几页的内容
        full_text = ""
        pages_to_read = min(max_pages, len(pdf.pages))

        for i in range(pages_to_read):
            try:
                page_text = pdf.pages[i].extract_text()
                full_text += f"\n=== 第{i+1}页 ===\n{page_text}"
                print(f"第{i+1}页文本长度: {len(page_text)}")
            except Exception as e:
                print(f"读取第{i+1}页时出错: {e}")

        print(f"\n总文本长度: {len(full_text)}")

        # 关键词统计
        keywords = ['Spring', 'WebFlux', '反应式', 'Reactive', '响应式', '编程', '异步', '流', 'Flux', 'Mono']
        print("\n关键词统计:")
        for keyword in keywords:
            count = full_text.count(keyword)
            if count > 0:
                print(f"  {keyword}: {count}次")

        print("\n内容预览:")
        print("-" * 40)
        print(full_text[:1000])
        print("-" * 40)

        return full_text

    except Exception as e:
        print(f"读取 {filename} 时出错: {e}")
        import traceback
        traceback.print_exc()
        return ""

def main():
    """主函数"""
    print("PDF内容读取工具")
    print("=" * 50)

    # 切换到脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print(f"工作目录: {script_dir}")

    # 获取当前目录中的PDF文件
    pdf_files = [f for f in os.listdir('.') if f.endswith('.pdf')]

    if not pdf_files:
        print("当前目录中没有找到PDF文件")
        return

    print(f"找到 {len(pdf_files)} 个PDF文件:")
    for i, f in enumerate(pdf_files, 1):
        file_size = os.path.getsize(f) / 1024 / 1024  # MB
        print(f"{i}. {f} ({file_size:.1f}MB)")
    # 读取每个PDF文件
    all_content = {}
    for filename in pdf_files:
        content = read_pdf_content(filename)
        all_content[filename] = content

    # 生成总结报告
    print(f"\n{'='*60}")
    print("总结报告")
    print(f"{'='*60}")

    for filename, content in all_content.items():
        if content:
            print(f"\n{filename}:")
            print(f"  总字符数: {len(content)}")
            print(f"  估计页数: {len(content) // 2000 + 1}")  # 粗略估计

            # 分析主要主题
            if 'WebFlux' in filename:
                if '快速上手' in filename:
                    print("  主题: Spring WebFlux快速上手教程")
                elif '开发反应式' in filename:
                    print("  主题: Spring 5 WebFlux开发指南")

if __name__ == "__main__":
    main()