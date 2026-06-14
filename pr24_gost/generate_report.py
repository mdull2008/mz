"""Руководство пользователя Todoist по ГОСТ Р 59795-2021."""

from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH


def main():
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Times New Roman"
    style.font.size = Pt(12)

    # Титульный лист
    for _ in range(4):
        doc.add_paragraph()
    t = doc.add_paragraph()
    t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = t.add_run("РУКОВОДСТВО ПОЛЬЗОВАТЕЛЯ\n\n")
    r.bold = True
    r.font.size = Pt(16)
    t.add_run("Программный продукт: Todoist\n").font.size = Pt(14)
    t.add_run("Версия: 2024\n\n")
    t.add_run("Организация / Автор: _________________________\n")
    t.add_run("Дата: _________________________")
    doc.add_page_break()

    # Содержание
    doc.add_heading("СОДЕРЖАНИЕ", level=1)
    for i, s in enumerate([
        "1. Назначение и область применения",
        "2. Общие сведения",
        "3. Установка и запуск",
        "4. Описание интерфейса и функций",
        "5. Примеры использования",
        "6. Возможные ошибки и пути их устранения",
        "7. Техническая поддержка",
        "Приложение А. Глоссарий",
        "Приложение Б. Ссылки",
    ], 1):
        doc.add_paragraph(s)

    doc.add_page_break()

    # 1
    doc.add_heading("1. Назначение и область применения", level=1)
    doc.add_paragraph(
        "Todoist — веб-сервис и приложение для управления задачами (to-do list). "
        "Позволяет создавать задачи, проекты, устанавливать сроки, приоритеты и напоминания."
    )
    doc.add_paragraph("Область применения: личное планирование, учёба, работа в команде.")
    doc.add_paragraph("Целевая аудитория: студенты, офисные сотрудники, фрилансеры — пользователи без специальных IT-навыков.")

    # 2
    doc.add_heading("2. Общие сведения", level=1)
    doc.add_heading("2.1. Требования к системе", level=2)
    doc.add_paragraph("• ОС: Windows 10/11, macOS 10.14+, Android 8+, iOS 14+")
    doc.add_paragraph("• Браузер (веб-версия): Chrome 90+, Firefox 88+, Safari 14+, Edge 90+")
    doc.add_paragraph("• Интернет: стабильное подключение")
    doc.add_paragraph("• ОЗУ: не менее 2 ГБ; место на диске: 100 МБ (мобильное приложение)")
    doc.add_heading("2.2. Комплект поставки", level=2)
    doc.add_paragraph("Программа распространяется в виде веб-сервиса (https://todoist.com) и мобильных приложений в App Store / Google Play. Установочные файлы не поставляются — доступ через браузер или магазин приложений.")

    # 3
    doc.add_heading("3. Установка и запуск", level=1)
    doc.add_heading("3.1. Веб-версия", level=2)
    doc.add_paragraph("1. Откройте браузер.")
    doc.add_paragraph("2. Перейдите по адресу https://www.todoist.com/ru")
    doc.add_paragraph("3. Нажмите «Начать бесплатно» или «Войти».")
    doc.add_paragraph("4. Зарегистрируйтесь (email + пароль) или войдите через Google/Apple.")
    doc.add_paragraph("(ВСТАВИТЬ СКРИНШОТ: главная страница Todoist)")
    doc.add_heading("3.2. Мобильное приложение", level=2)
    doc.add_paragraph("1. Откройте App Store (iOS) или Google Play (Android).")
    doc.add_paragraph("2. Найдите «Todoist».")
    doc.add_paragraph("3. Нажмите «Установить».")
    doc.add_paragraph("4. Запустите приложение и войдите в аккаунт.")
    doc.add_paragraph("(ВСТАВИТЬ СКРИНШОТ: установка из магазина)")
    doc.add_heading("3.3. Первоначальный запуск", level=2)
    doc.add_paragraph("После входа отображается экран «Сегодня» со списком задач на текущий день.")
    doc.add_paragraph("(ВСТАВИТЬ СКРИНШОТ: главное окно после входа)")
    doc.add_heading("3.4. Проблемы при установке", level=2)
    doc.add_paragraph("• Не открывается сайт — проверьте интернет и URL.")
    doc.add_paragraph("• Приложение не устанавливается — обновите ОС или освободите место.")

    # 4
    doc.add_heading("4. Описание интерфейса и функций", level=1)
    doc.add_heading("4.1. Главное окно", level=2)
    doc.add_paragraph("Элементы интерфейса:")
    doc.add_paragraph("• Боковая панель — проекты, метки, фильтры")
    doc.add_paragraph("• Центральная область — список задач")
    doc.add_paragraph("• Кнопка «+ Добавить задачу» — создание новой задачи")
    doc.add_paragraph("• Верхняя панель — поиск, настройки, профиль")
    doc.add_paragraph("(ВСТАВИТЬ СКРИНШОТ: главное окно с подписями)")
    doc.add_heading("4.2. Основные операции", level=2)
    ops = [
        ("Создать задачу", "Нажать «+», ввести название, Enter"),
        ("Установить срок", "Кликнуть на задачу → выбрать дату"),
        ("Приоритет", "Флажок: красный (высокий), оранжевый, синий, без флага"),
        ("Проект", "Создать в боковой панели → «Добавить проект»"),
        ("Выполнить задачу", "Отметить галочкой слева от задачи"),
        ("Удалить задачу", "ПКМ → Удалить или свайп влево (моб.)"),
    ]
    for name, how in ops:
        doc.add_paragraph(f"• {name}: {how}")

    # 5
    doc.add_heading("5. Примеры использования", level=1)
    doc.add_heading("Сценарий 1: План на день", level=2)
    doc.add_paragraph("1. Открыть раздел «Сегодня».")
    doc.add_paragraph("2. Добавить задачи: «Купить продукты», «Сдать отчёт».")
    doc.add_paragraph("3. Установить срок «Сегодня» для каждой.")
    doc.add_paragraph("4. По выполнению — отметить галочкой.")
    doc.add_heading("Сценарий 2: Проект для учёбы", level=2)
    doc.add_paragraph("1. Создать проект «Университет».")
    doc.add_paragraph("2. Добавить задачи: «Лабораторная ПР-24», «Подготовка к экзамену».")
    doc.add_paragraph("3. Установить дедлайны и приоритеты.")
    doc.add_paragraph("(ВСТАВИТЬ СКРИНШОТ: проект с задачами)")

    # 6
    doc.add_heading("6. Возможные ошибки и пути их устранения", level=1)
    tbl_data = [
        ("Не синхронизируются задачи", "Проверить интернет, выйти и войти снова"),
        ("Не приходят уведомления", "Настройки → Уведомления → включить"),
        ("Забыл пароль", "На экране входа → «Забыли пароль?»"),
        ("Задача не сохраняется", "Обновить страницу, проверить соединение"),
    ]
    t = doc.add_table(rows=1, cols=2)
    t.style = "Table Grid"
    t.rows[0].cells[0].text = "Проблема"
    t.rows[0].cells[1].text = "Решение"
    for a, b in tbl_data:
        row = t.add_row().cells
        row[0].text = a
        row[1].text = b
    doc.add_paragraph()

    # 7
    doc.add_heading("7. Техническая поддержка", level=1)
    doc.add_paragraph("• Справочный центр: https://todoist.com/ru/help")
    doc.add_paragraph("• Email: support@todoist.com")
    doc.add_paragraph("• Сообщество: форум на сайте Todoist")

    doc.add_page_break()
    doc.add_heading("Приложение А. Глоссарий", level=1)
    doc.add_paragraph("Задача — единица работы с названием и опциональным сроком.")
    doc.add_paragraph("Проект — группа связанных задач.")
    doc.add_paragraph("Метка — тег для категоризации задач.")
    doc.add_paragraph("Фильтр — сохранённый набор условий отбора задач.")

    doc.add_page_break()
    doc.add_heading("Приложение Б. Ссылки", level=1)
    doc.add_paragraph("• Официальный сайт: https://www.todoist.com/ru")
    doc.add_paragraph("• ГОСТ Р 59795–2021: требования к руководству пользователя")

    doc.save("/workspace/pr24_gost/Руководство_пользователя_Todoist_ГОСТ.docx")
    print("OK")


if __name__ == "__main__":
    main()
