from g4f.client import Client
import asyncio
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
client = Client()

def get_chat_completion(prompt, mode):
    messages = [{"role": "user", "content": f'''You are a expert JavaScript Developer! I want you to {mode.lower()} this code: {prompt}. Use English Language'''}]
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        language="en"
    )
    return completion.choices[0].message.content