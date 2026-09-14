"""
Central model configuration for Truthline.

All AI/ML model names are read from environment variables.
No model names are hardcoded — swap providers by changing .env.local.

Covers:
- Vision-Language Model (VLM): frame-by-frame body cam analysis
- Text LLM: report generation, summarization, Q&A
- Speech-to-Text (STT): audio transcription
- Multimodal: direct video-to-report generation

Usage:
    from model_config import models
    model = models.vision_model()   # returns (model_name, api_key, provider)
"""

import os
from dataclasses import dataclass
from dotenv import load_dotenv

_env_path = os.path.join(os.path.dirname(__file__), ".env.local")
load_dotenv(_env_path)


@dataclass(frozen=True)
class ModelEntry:
    """Immutable model reference."""
    name: str
    api_key: str
    base_url: str | None = None

    def __str__(self) -> str:
        return self.name


class Models:
    """
    Reads model names from environment variables.
    Defaults match current production — override via .env.local.
    """

    # ── Vision-Language Model (VLM) ──────────────────────────────
    # Used for: frame-by-frame body cam image analysis
    # Must support vision (image input). Examples:
    #   OpenAI:  gpt-4o-mini, gpt-4o, gpt-4.1-mini
    #   Google:  gemini-2.0-flash, gemini-2.5-flash
    #   Local:   llava, moondream (via OpenAI-compatible endpoint)
    def vision_model(self) -> ModelEntry:
        provider = os.getenv("VISION_LLM_PROVIDER", "openai").lower()
        name = os.getenv("VISION_MODEL", "gpt-4o-mini")
        key = self._key(provider)
        base = os.getenv("VISION_BASE_URL")  # for local/self-hosted
        return ModelEntry(name=name, api_key=key, base_url=base)

    # ── Text LLM ─────────────────────────────────────────────────
    # Used for: report summarization, missing-info Qs, formal reports
    # Text-only (no vision needed). Examples:
    #   OpenAI:  gpt-4o-mini, gpt-4.1-mini, gpt-4.1-nano
    #   Anthropic: claude-sonnet-4-20250514, claude-3-5-haiku-20241022
    #   Google:  gemini-2.0-flash, gemini-2.5-flash
    #   Local:   llama-3.1-8b, mistral-7b, qwen-2.5-7b (via OpenAI-compatible)
    def text_llm(self) -> ModelEntry:
        provider = os.getenv("TEXT_LLM_PROVIDER", "openai").lower()
        name = os.getenv("TEXT_MODEL", "gpt-4o-mini")
        key = self._key(provider)
        base = os.getenv("TEXT_BASE_URL")  # for local/self-hosted
        return ModelEntry(name=name, api_key=key, base_url=base)

    # ── Formal Report LLM ────────────────────────────────────────
    # Used for: high-quality formal police report generation
    # Typically a stronger model than the text LLM. Examples:
    #   OpenAI:  gpt-4o, gpt-4.1
    #   Anthropic: claude-sonnet-4-20250514
    #   Local:   llama-3.1-70b, qwen-2.5-72b
    def formal_report_model(self) -> ModelEntry:
        provider = os.getenv("FORMAL_REPORT_PROVIDER", "openai").lower()
        name = os.getenv("FORMAL_REPORT_MODEL", "gpt-4o")
        key = self._key(provider)
        base = os.getenv("FORMAL_REPORT_BASE_URL")
        return ModelEntry(name=name, api_key=key, base_url=base)

    # ── Speech-to-Text (Whisper-class) ───────────────────────────
    # Used for: OpenAI Whisper API transcription
    # Examples: whisper-1, whisper-large-v3, turbo
    def whisper_model(self) -> ModelEntry:
        name = os.getenv("WHISPER_MODEL", "whisper-1")
        key = os.getenv("OPENAI_API_KEY", "")
        base = os.getenv("WHISPER_BASE_URL")  # for local whisper
        return ModelEntry(name=name, api_key=key, base_url=base)

    # ── Speech-to-Text (Deepgram) ────────────────────────────────
    # Used for: Deepgram Nova transcription
    # Examples: nova-2, nova-2-phonecall, nova-2-medical
    def deepgram_model(self) -> ModelEntry:
        name = os.getenv("DEEPGRAM_MODEL", "nova-2")
        key = os.getenv("DEEPGRAM_API_KEY", "")
        return ModelEntry(name=name, api_key=key)

    # ── Multimodal Video Model ────────────────────────────────────
    # Used for: direct video buffer → report (Gemini postProcessing)
    # Must accept video input. Examples:
    #   Google:  gemini-2.0-flash-exp, gemini-2.5-flash
    #   OpenAI:  gpt-4o (via base64 frames)
    def video_model(self) -> ModelEntry:
        provider = os.getenv("VIDEO_MODEL_PROVIDER", "google").lower()
        name = os.getenv("VIDEO_MODEL", "gemini-2.0-flash-exp")
        key = self._key(provider)
        base = os.getenv("VIDEO_MODEL_BASE_URL")
        return ModelEntry(name=name, api_key=key, base_url=base)

    # ── Audio Detection Model ─────────────────────────────────────
    # Used for: gunshot/taser/explosion detection
    # Currently YAMNet (TensorFlow) — kept separate from LLM config
    def audio_detection_model(self) -> str:
        return os.getenv("AUDIO_DETECTION_MODEL", "yamnet")

    # ── Helpers ───────────────────────────────────────────────────
    @staticmethod
    def _key(provider: str) -> str:
        """Resolve API key from provider name."""
        env_map = {
            "openai": "OPENAI_API_KEY",
            "anthropic": "ANTHROPIC_API_KEY",
            "google": "GEMINI_API_KEY",
            "gemini": "GEMINI_API_KEY",
            "groq": "GROQ_API_KEY",
            "together": "TOGETHER_API_KEY",
            "ollama": "",  # local, no key needed
            "lmstudio": "",  # local, no key needed
            "vllm": "",  # local, no key needed
        }
        var = env_map.get(provider, "")
        return os.getenv(var, "") if var else ""

    @staticmethod
    def list_providers() -> list[str]:
        """Supported provider names."""
        return ["openai", "anthropic", "google", "groq", "together", "ollama", "lmstudio", "vllm"]


# Singleton — import and use directly
models = Models()
