# Zelflayer: The Fully-Local macOS Assistant That Understands Your Documents Through Voice

How one powerful AppleScript tool + vector + graph search created the ultimate private AI assistant

## The Problem: When AI Assistants Can't See Your World

I was drowning in documents. Research papers scattered across my Downloads folder, meeting notes buried in subdirectories, contracts I signed months ago that I suddenly needed to reference. Like most knowledge workers, I had built a personal digital library over years, but it was opaque—searchable only by filename and hope.

Meanwhile, the AI assistants I used were cloud-based black boxes that couldn't access my local files, required constant internet connectivity, and raised serious privacy concerns when dealing with sensitive documents.

I needed something different: a fully local, voice-activated assistant that could actually understand my document collection and help me navigate my digital life.

The breakthrough came from an unexpected place: AppleScript.

## The Eureka Moment: One Tool to Rule Them All

Most AI agent frameworks use rigid, pre-defined tools. You want to check your calendar? Here's a get_calendar_events() function. Need to send an email? Use send_email(). But what happens when Apple changes their API? Or when you need to interact with a niche application? The whole system breaks.

I realized the solution wasn't more tools—it was one infinitely flexible tool that could do everything: dynamic AppleScript generation.

Here's the entire "tool" that powers Zelflayer's macOS automation:

```python
async def execute_applescript(script: str) -> str:
    """Execute any AppleScript code and return the result"""
    stdout, stderr = run_applescript_capture(script)
    return stdout if not stderr else f"Error: {stderr}"
```

That's it. One function. But it's Turing-complete access to every macOS application, service, and system function. No API limits, no version dependencies, no maintenance overhead.

## The Magic: How Dynamic AppleScript Solves Everything

Let me show you what this looks like in practice:

User Request: "Find the latest email from Sarah and create a calendar event for tomorrow at 2pm titled 'Follow up with Sarah' with a reminder"

Agent's Thought Process:
1. Query Mail app for Sarah's latest email
2. Extract the subject line for context
3. Create calendar event with proper date formatting
4. Create reminder linked to the event
5. Confirm everything was created successfully

The Generated AppleScript:

```applescript
tell application "Mail"
    set theMessages to messages of inbox whose sender contains "sarah"
    if (count of theMessages) > 0 then
        set theLastMessage to item -1 of theMessages
        return subject of theLastMessage & " sent on " & (date sent of theLastMessage as string)
    end if
end tell
```

The agent iteratively writes, executes, and refines AppleScript until the task is complete. If one approach fails, it tries another. No human intervention required.

## Beyond Tools: The Vector + Graph Revolution

But macOS automation was only half the battle. I needed the assistant to actually understand my documents, not just execute commands.

Traditional RAG (Retrieval-Augmented Generation) systems use vector search—finding semantically similar text chunks. This works well for general similarity but misses the rich relationships between entities in your documents.

Zelflayer's breakthrough combines both approaches:

### 1. Vector Search: Semantic Similarity

```python
# Find chunks similar to "quarterly revenue"
similar_chunks = await vector_search_chunks(query_embedding, top_k=3)
# Returns: ["Q3 revenue increased 15%...", "Financial performance metrics...", "Sales figures by region..."]
```

### 2. Knowledge Graph: Entity Relationships

```python
# Find entities and their connections
graph_data = await get_1hop_bidirectional_graph("Apple Inc")
# Returns: Apple Inc → founded → Apple Research, Apple Inc → develops → Watson, etc.
```

### 3. Combined Context: The Full Picture

```python
# Merge vector chunks with graph relationships
combined_context = f"""
Vector Knowledge:
{vector_context}

Graph Knowledge:
{graph_context}
"""
```

This hybrid approach means when you ask "What were Apple's key partnerships last quarter?", the system can:
- Find relevant financial documents via vector similarity
- Extract entity relationships showing Apple's partnerships
- Combine both for a comprehensive answer

## Real-World Impact: A Day With Zelflayer

Here's how this plays out in practice:

### Morning: "Show me my calendar and find any emails about today's meetings"
- Agent checks Calendar app via AppleScript
- Searches Mail for meeting-related keywords
- Cross-references attendees with Contacts
- Provides consolidated briefing

### Work Session: "Process this research paper and tell me the key findings"
- Converts PDF to structured document using Docling
- Extracts knowledge graph of entities and relationships
- Creates searchable chunks with embeddings
- Answers questions about the content with full context

### Evening: "Create reminders for all the action items from today's documents"
- Searches through processed documents
- Identifies action items and deadlines
- Creates Reminders with appropriate due dates
- Links back to source documents

## The Technical Architecture: Privacy-First Design

Everything runs locally:
- Whisper tiny.en: Voice transcription on-device
- Ollama: Local LLM inference (Granite models)
- SurrealDB: Embedded graph+vector database
- MLX: Apple's machine learning framework for Mac optimization

No data leaves your machine. Your documents, voice commands, and personal information stay private.

## Performance That Surprises

The system is remarkably fast:
- Voice transcription: ~2 seconds for 15-second audio
- Document processing: ~2 seconds per page
- Knowledge graph extraction: ~0.5 seconds per chunk
- Vector + graph search: <100ms combined

The AppleScript execution is nearly instantaneous since it's native macOS integration.

## Building Your Own: The Key Components

- Voice Interface: Faster-Whisper + PyAudio for recording
- Document Processing: Docling for PDF→structured text + REBEL for entity extraction
- Storage: SurrealDB for hybrid graph/vector storage
- Agent: Code-generating LLM that writes AppleScript
- Integration: One AppleScript execution tool that does everything

## The Future: Where This Goes Next

This architecture scales beyond documents:
- Voice-controlled workflows: "Process all PDFs in this folder and summarize them"
- Cross-application automation: "Find receipts in Mail and add them to a Numbers spreadsheet"
- Intelligent scheduling: "Based on my calendar availability and these meeting notes, schedule follow-ups"
- Research assistance: "Find all references to 'climate change' in my documents and create a summary note"

## Why This Matters: The Personal AI Revolution

Zelflayer represents a fundamental shift: from cloud-dependent AI assistants that know nothing about your life, to personal AI that lives in your digital world. It sees your documents, understands your schedule, knows your contacts, and can act across all your applications.

The combination of dynamic AppleScript generation with vector+graph RAG creates something unique: an assistant that doesn't just respond to commands, but understands your context and takes action across your entire digital ecosystem.

Fully local. Voice-activated. Infinitely capable.

That's the power of one simple AppleScript tool combined with intelligent document understanding.

Try it yourself: The Zelflayer project is open source. One AppleScript function. Endless possibilities.