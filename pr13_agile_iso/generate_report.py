"""Word-отчёт: практическая работа 13 — Стандарты vs Agile."""

from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH


def main():
    doc = Document()
    doc.styles["Normal"].font.name = "Times New Roman"
    doc.styles["Normal"].font.size = Pt(12)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run('ПРАКТИЧЕСКАЯ РАБОТА №13\n«Стандарты vs Agile в реальном проекте»')
    r.bold = True
    r.font.size = Pt(14)
    doc.add_paragraph("Студент: _________________________  Группа: _________________________")
    doc.add_paragraph("Дата: _________________________")
    doc.add_paragraph()

    doc.add_heading("Часть 1. Анализ", level=1)

    doc.add_paragraph("1. Какие элементы ISO 29119 будут полезны в Agile-проекте?")
    for s in [
        "Матрица прослеживаемости (требование → тест → результат)",
        "Критерии входа/выхода для спринта и релиза",
        "Единый шаблон баг-репорта",
        "Test Summary Report по итогам спринта",
        "Определение уровней и видов тестирования",
        "Управление рисками (таблица рисков)",
    ]:
        doc.add_paragraph(s, style="List Bullet")

    doc.add_paragraph("2. Какие элементы могут вызвать сопротивление?")
    for s in [
        "Полный Test Plan на 20+ страниц — слишком долго для 2-недельного спринта",
        "Детальные тест-кейсы на каждую мелочь — замедляет разработку",
        "Обязательное согласование документов до начала спринта",
        "Формальная отчётность «для галочки»",
        "Дублирование информации в Word + Jira + Confluence",
    ]:
        doc.add_paragraph(s, style="List Bullet")

    doc.add_paragraph("3. В чём может возникнуть конфликт?")
    doc.add_paragraph(
        "Agile ценит скорость и гибкость, ISO 29119 — формальность и полноту документации. "
        "Конфликты: требования меняются в спринте, а тест-план уже «утверждён»; команда хочет "
        "exploratory testing, стандарт требует формальных кейсов; мало времени на документы при "
        "двухнедельных релизах; разные ожидания от «готовности к релизу»."
    )

    doc.add_paragraph("4. Что из стандартов точно нельзя игнорировать?")
    for s in [
        "Прослеживаемость требований (что тестировали и зачем)",
        "Фиксация дефектов с шагами воспроизведения",
        "Критерии готовности к релизу (exit criteria)",
        "Отчёт о результатах тестирования",
        "Управление рисками качества",
    ]:
        doc.add_paragraph(s, style="List Bullet")

    doc.add_heading("Часть 2. Практика — упрощённая модель документации", level=1)

    doc.add_heading("1. Test Plan", level=2)
    doc.add_paragraph("Формат: страница в Confluence (шаблон «Test Plan Sprint N»), не отдельный Word.")
    doc.add_paragraph("Обновляется в начале каждого спринта (15–30 мин).")
    doc.add_paragraph("Обязательно включить:")
    for s in [
        "Цель тестирования спринта",
        "User Stories в scope (ссылки на Jira)",
        "Out of scope",
        "Виды тестирования (smoke, регрессия, новый функционал)",
        "Риски (таблица: риск / влияние / митигация)",
        "Entry criteria: сборка в test-среде, AC готовы",
        "Exit criteria: 90% тестов Pass, 0 Blocker, ≤2 Major",
        "Ответственный тестировщик",
    ]:
        doc.add_paragraph(s, style="List Bullet")

    doc.add_heading("2. Где хранятся тест-кейсы", level=2)
    doc.add_paragraph("• Критичные сценарии — тест-кейсы в Zephyr / TestRail (или Jira + плагин)")
    doc.add_paragraph("• Smoke и регрессия — чек-листы в Confluence")
    doc.add_paragraph("• Exploratory — заметки в Confluence / Jira")
    doc.add_paragraph("Прослеживаемость:")
    doc.add_paragraph("• User Story в Jira → ссылка на тест-кейсы (поле «Tests»)")
    doc.add_paragraph("• Матрица в Confluence: US-ID | AC | Test-ID | Статус")
    doc.add_paragraph("• Баги в Jira привязаны к US и тест-кейсу")

    doc.add_heading("3. Отчётность", level=2)
    doc.add_paragraph("• Test Summary по спринту — страница Confluence в конце спринта")
    doc.add_paragraph("• Содержание: scope, Pass/Fail/Blocked, список багов, риски, рекомендация")
    doc.add_paragraph("• Метрики в Jira / дашборде:")
    for s in [
        "% выполненных тестов",
        "Количество открытых багов по severity",
        "Defect density (баги / story point)",
        "Покрытие US тестами (%)",
    ]:
        doc.add_paragraph(s, style="List Bullet")
    doc.add_paragraph("• Еженедельно на ретро — краткий устный отчёт + ссылка на Confluence")

    doc.add_heading("Вывод", level=1)
    doc.add_paragraph(
        "ISO 29119 и Agile совместимы, если брать из стандарта идеи (прослеживаемость, критерии, отчёты), "
        "а не тяжёлые документы. Test Plan — одна страница Confluence на спринт, кейсы — в Jira/TestRail, "
        "отчёт — Test Summary + метрики. Главное — польза команде, а не форма ради формы."
    )

    doc.save("/workspace/pr13_agile_iso/Отчет_Практическая_13_Стандарты_vs_Agile.docx")
    print("OK")


if __name__ == "__main__":
    main()
