import chromadb
from chromadb.utils import embedding_functions
import os
from typing import List, Dict
import logging
from scraper.shl_scraper import SHLScraper

logger = logging.getLogger(__name__)

class VectorDB:
    def __init__(self, persist_directory: str = "./data/chroma_db"):
        self.persist_directory = persist_directory
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection_name = "shl_assessments"
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self.embedding_fn
        )

    def ingest_data(self, assessments: List[Dict]):
        """
        Ingests assessment data into ChromaDB.
        """
        logger.info(f"Ingesting {len(assessments)} assessments into vector DB...")
        
        ids = []
        documents = []
        metadatas = []

        for idx, item in enumerate(assessments):
            # Create a rich text representation for embedding
            text_content = f"""
            Assessment Name: {item['name']}
            Category: {item['category']}
            Type: {item['test_type']}
            Description: {item['description']}
            Skills Measured: {item['skills_measured']}
            Duration: {item['duration']}
            """
            
            ids.append(f"shl_{idx}")
            documents.append(text_content)
            metadatas.append({
                "name": item['name'],
                "url": item['url'],
                "test_type": item['test_type'],
                "category": item['category'],
                "duration": item['duration'],
                "skills_measured": item['skills_measured']
            })

        self.collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )
        logger.info("Ingestion complete.")

    def search(self, query: str, n_results: int = 5) -> List[Dict]:
        """
        Performs semantic search on the collection.
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        formatted_results = []
        if results['metadatas']:
            for meta in results['metadatas'][0]:
                formatted_results.append(meta)
        
        return formatted_results

    def get_stats(self):
        return {
            "count": self.collection.count(),
            "name": self.collection_name
        }

if __name__ == "__main__":
    # Test ingestion
    db = VectorDB()
    scraper = SHLScraper()
    data = scraper.scrape_catalog()
    db.ingest_data(data)
    print(f"DB now contains {db.get_stats()['count']} items.")
