from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_groq import ChatGroq
import dotenv

dotenv.load_dotenv()

class Keywords(BaseModel):
    """
    Keywords extracted from the text by the model.
    """
    keywords: str = Field(..., title="Keywords", description="Keywords extracted from the text")

def extract_keywords(text: str):
    chat = ChatGroq(temperature=0.1, model="llama3-70b-8192",)

    structured_llm = chat.with_structured_output(Keywords)
    prompt_template = """You are patent lawyer with years of experience in the field.
You about the get text of a draft of a patent. you need to extract the keywords as many as possible from the text to 
understand the main points of the patent:
{text}"""
    return structured_llm.invoke(prompt_template.format(text=text)).keywords.split(", ")
    
if __name__ == "__main__":
    out = extract_keywords("""
Low latency is crucial for Large Language Models (LLMs) because it directly impacts the user experience, model 
performance, and overall efficiency of language-based applications. Here are some reasons why low latency is essential 
for LLMs:\n\n1. **Real-time Interaction**: LLMs are often used in applications that require real-time interaction, 
such as chatbots, virtual assistants, and language translation systems. Low latency ensures that the model responds 
quickly to user input, providing a seamless and engaging experience.\n2. **Conversational Flow**: In conversational AI,
latency can disrupt the natural flow of conversation. High latency can lead to awkward pauses, making the interaction 
feel unnatural and frustrating. Low latency helps maintain a smooth conversation, allowing users to engage more 
naturally with the model.\n3. **Model Performance**: LLMs rely on complex algorithms and massive datasets to generate 
responses. High latency can lead to increased computational overhead, which can negatively impact model performance, 
accuracy, and reliability. Low latency enables the model to process requests efficiently, reducing the risk of errors 
and inaccuracies.\n4. **Scalability**: As the number of users and requests increases, high latency can become a 
bottleneck, limiting the scalability of LLM-based applications. Low latency enables the model to handle a higher 
volume of requests, making it more suitable for large-scale deployments.\n5. **User Experience**: High latency can 
lead to user frustration, abandonment, and a negative overall experience. Low latency ensures that users receive prompt 
responses, which is essential for building trust, satisfaction, and loyalty.\n6. **Competitive Advantage**: In today's 
fast-paced digital landscape, low latency can be a key differentiator for LLM-based applications. By providing rapid 
responses, businesses can gain a competitive edge, improve customer satisfaction, and drive revenue growth.\n7. 
**Edge Computing**: With the increasing adoption of edge computing, low latency is critical for LLMs to process data
closer to the user, reducing latency and improving real-time processing capabilities.\n8. 
**Safety-Critical Applications**: In safety-critical applications, such as autonomous vehicles or medical diagnosis, 
high latency can have severe consequences. Low latency ensures that LLMs provide timely and accurate responses, which 
is essential for making critical decisions.\n9. **Cost Savings**: High latency can result in increased infrastructure 
costs, as more resources are required to handle the increased computational overhead. Low latency helps reduce 
infrastructure costs, making LLM-based applications more cost-effective.\n10. **Future-Proofing**: As LLMs continue 
to evolve and become more pervasive, low latency will become even more critical. By prioritizing low latency today, 
developers can future-proof their applications and ensure they remain competitive and effective in the long run.\n\nIn 
summary, low latency is vital for LLMs to provide a seamless user experience, maintain model performance, and ensure 
scalability, competitiveness, and cost-effectiveness. By prioritizing low latency, developers can unlock the full 
potential of LLMs and create innovative applications that transform industries and improve live
                     """)
    print(out)