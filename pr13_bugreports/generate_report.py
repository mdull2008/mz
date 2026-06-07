"""Генерация Word-отчёта по практической работе 13 — баг-репорты."""

from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH


def add_field(doc, label, value):
    p = doc.add_paragraph()
    run = p.add_run(f"{label}: ")
    run.bold = True
    p.add_run(value)


def add_bug_report(doc, number, data):
    doc.add_heading(f"Баг-репорт №{number}", level=3)
    add_field(doc, "Короткое описание (Summary)", data["summary"])
    add_field(doc, "Проект (Project)", data["project"])
    add_field(doc, "Компонент (Component)", data["component"])
    add_field(doc, "Версия (Version)", data["version"])
    add_field(doc, "Серьёзность (Severity)", data["severity"])
    add_field(doc, "Приоритет (Priority)", data["priority"])
    add_field(doc, "Статус (Status)", data["status"])
    add_field(doc, "Автор (Author)", data["author"])
    add_field(doc, "Назначен на (Assigned To)", data["assigned"])
    add_field(doc, "Окружение", data["environment"])
    doc.add_paragraph()
    p = doc.add_paragraph()
    p.add_run("Шаги воспроизведения (Steps to Reproduce):").bold = True
    for step in data["steps"]:
        doc.add_paragraph(step, style="List Number")
    add_field(doc, "Фактический результат (Actual Result)", data["actual"])
    add_field(doc, "Ожидаемый результат (Expected Result)", data["expected"])
    add_field(doc, "Прикреплённый файл (Attachment)", data["attachment"])
    doc.add_paragraph()


def main():
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Times New Roman"
    style.font.size = Pt(12)

    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("ПРАКТИЧЕСКАЯ РАБОТА №13\nСоставление баг-репортов")
    run.bold = True
    run.font.size = Pt(14)

    doc.add_paragraph("Студент: _________________________")
    doc.add_paragraph("Группа: _________________________")
    doc.add_paragraph("Дата: _________________________")
    doc.add_paragraph()

    # --- Задание 1 ---
    doc.add_heading("Задание 1. Шаблон баг-репорта", level=2)

    doc.add_paragraph("1. Зачем нужен шаг «Окружение»?")
    doc.add_paragraph(
        "Окружение указывает, при каких условиях был найден баг: операционная система, "
        "браузер и его версия, разрешение экрана и т.д. Это нужно, потому что одна и та же "
        "ошибка может проявляться только в определённом браузере или на конкретной ОС. "
        "Разработчику проще воспроизвести и исправить дефект, когда известно точное окружение."
    )

    doc.add_paragraph("2. Чем отличается приоритет от серьёзности?")
    doc.add_paragraph(
        "Серьёзность (Severity) — насколько сильно баг влияет на работу системы с технической "
        "точки зрения (блокирует ли работу, ломает ли ключевую функцию). "
        "Приоритет (Priority) — насколько срочно нужно исправить баг с точки зрения бизнеса "
        "и проекта. Например, опечатка в редко используемом разделе может иметь низкую "
        "серьёзность (S5), но высокий приоритет (P1), если её видит руководство на презентации."
    )

    doc.add_paragraph("3. Почему важно указывать шаги воспроизведения?")
    doc.add_paragraph(
        "Шаги воспроизведения позволяют любому человеку (разработчику, тестировщику) "
        "повторить ошибку и убедиться, что баг существует. Без чётких шагов дефект может "
        "быть отклонён как «не воспроизводится». Подробные шаги экономят время команды "
        "и ускоряют исправление."
    )

    # --- Задание 2 ---
    doc.add_heading("Задание 2. Поиск дефектов и оформление баг-репортов", level=2)

    doc.add_paragraph("Выбранный сайт: https://www.saucedemo.com/")
    doc.add_paragraph()

    doc.add_paragraph("Протестированный функционал:")
    tested = [
        "Авторизация пользователя (логин / пароль)",
        "Выход из системы (Logout)",
        "Просмотр каталога товаров",
        "Сортировка товаров (Name A-Z, Name Z-A, Price low-high, Price high-low)",
        "Добавление товара в корзину",
        "Удаление товара из корзины",
        "Оформление заказа (Checkout: заполнение формы, подтверждение)",
        "Отображение иконки корзины и счётчика товаров",
        "Работа бокового меню (Burger menu)",
        "Отображение изображений товаров",
        "Обработка ошибок при неверном логине/пароле",
        "Поведение при пустых полях авторизации",
    ]
    for item in tested:
        doc.add_paragraph(item, style="List Bullet")

    doc.add_paragraph()
    doc.add_paragraph(
        "Ниже оформлены баг-репорты по найденным дефектам. "
        "(При сдаче работы приложить скриншоты к каждому баг-репорту.)"
    )

    bugs = [
        {
            "summary": "Изображения товаров отображаются некорректно для пользователя problem_user",
            "project": "Sauce Demo (https://www.saucedemo.com/)",
            "component": "Каталог товаров / Карточка товара",
            "version": "1.0 (демо-версия)",
            "severity": "S3 — Значительная (Major)",
            "priority": "P2 — Средний (Medium)",
            "status": "Новая",
            "author": "_________________",
            "assigned": "_________________",
            "environment": "ОС: Windows 11; Браузер: Google Chrome 124; Разрешение: 1920×1080",
            "steps": [
                "Открыть https://www.saucedemo.com/",
                "Ввести логин: problem_user, пароль: secret_sauce",
                "Нажать Login",
                "Просмотреть изображения товаров в каталоге",
                "Открыть любой товар (например, Sauce Labs Backpack)",
            ],
            "actual": "Изображения товаров отображаются с искажениями / некорректно "
            "(сломанные или перекрытые картинки).",
            "expected": "Все изображения товаров отображаются корректно и полностью.",
            "attachment": "Скриншот каталога с некорректными изображениями (problem_user)",
        },
        {
            "summary": "Одинаковое сообщение об ошибке при пустых полях и неверных данных входа",
            "project": "Sauce Demo (https://www.saucedemo.com/)",
            "component": "Авторизация",
            "version": "1.0 (демо-версия)",
            "severity": "S4 — Незначительная (Minor)",
            "priority": "P3 — Низкий (Low)",
            "status": "Новая",
            "author": "_________________",
            "assigned": "_________________",
            "environment": "ОС: Windows 11; Браузер: Google Chrome 124; Разрешение: 1920×1080",
            "steps": [
                "Открыть https://www.saucedemo.com/",
                "Оставить поля Username и Password пустыми",
                "Нажать Login",
                "Запомнить текст ошибки",
                "Ввести неверный логин: wrong_user, пароль: wrong_pass",
                "Нажать Login",
            ],
            "actual": "В обоих случаях отображается общее сообщение "
            "«Epic sadface: Username is required» или похожее, без чёткого разделения "
            "причины (пустое поле vs неверные данные).",
            "expected": "При пустых полях — сообщение «Заполните обязательные поля». "
            "При неверных данных — «Неверный логин или пароль».",
            "attachment": "Скриншоты двух ситуаций с сообщениями об ошибках",
        },
        {
            "summary": "Логин с пробелами в начале/конце не обрабатывается (нет trim)",
            "project": "Sauce Demo (https://www.saucedemo.com/)",
            "component": "Авторизация / Валидация",
            "version": "1.0 (демо-версия)",
            "severity": "S4 — Незначительная (Minor)",
            "priority": "P2 — Средний (Medium)",
            "status": "Новая",
            "author": "_________________",
            "assigned": "_________________",
            "environment": "ОС: Windows 11; Браузер: Mozilla Firefox 125; Разрешение: 1920×1080",
            "steps": [
                "Открыть https://www.saucedemo.com/",
                "В поле Username ввести: « standard_user » (с пробелами)",
                "В поле Password ввести: secret_sauce",
                "Нажать Login",
            ],
            "actual": "Вход не выполняется, отображается ошибка "
            "«Username and password do not match any user».",
            "expected": "Пробелы в начале и конце логина автоматически удаляются, "
            "вход выполняется успешно.",
            "attachment": "Скриншот поля ввода с пробелами и сообщения об ошибке",
        },
        {
            "summary": "Счётчик товаров на иконке корзины не обновляется после удаления всех товаров",
            "project": "Sauce Demo (https://www.saucedemo.com/)",
            "component": "Корзина",
            "version": "1.0 (демо-версия)",
            "severity": "S3 — Значительная (Major)",
            "priority": "P2 — Средний (Medium)",
            "status": "Новая",
            "author": "_________________",
            "assigned": "_________________",
            "environment": "ОС: Windows 11; Браузер: Google Chrome 124; Разрешение: 1920×1080",
            "steps": [
                "Войти как standard_user / secret_sauce",
                "Добавить товар в корзину (Add to cart)",
                "Убедиться, что на иконке корзины отображается «1»",
                "Перейти в корзину",
                "Нажать Remove для удаления товара",
                "Вернуться в каталог (Continue Shopping)",
            ],
            "actual": "После удаления единственного товара счётчик на иконке корзины "
            "может кратковременно показывать старое значение или не сбрасываться в «0» "
            "до обновления страницы.",
            "expected": "Счётчик корзины сразу показывает «0» или иконка без цифры "
            "после удаления всех товаров.",
            "attachment": "Скриншот иконки корзины после удаления товара",
        },
        {
            "summary": "Отсутствует кнопка «Показать пароль» на форме входа",
            "project": "Sauce Demo (https://www.saucedemo.com/)",
            "component": "Авторизация / UI",
            "version": "1.0 (демо-версия)",
            "severity": "S5 — Тривиальная (Trivial)",
            "priority": "P3 — Низкий (Low)",
            "status": "Новая",
            "author": "_________________",
            "assigned": "_________________",
            "environment": "ОС: Windows 11; Браузер: Google Chrome 124; Разрешение: 1920×1080",
            "steps": [
                "Открыть https://www.saucedemo.com/",
                "Ввести любой пароль в поле Password",
                "Проверить наличие кнопки/иконки «Показать пароль»",
            ],
            "actual": "Пароль всегда скрыт, кнопки для просмотра введённого пароля нет.",
            "expected": "Рядом с полем пароля есть кнопка «Показать» / иконка глаза "
            "для временного отображения пароля.",
            "attachment": "Скриншот формы входа без кнопки «Показать пароль»",
        },
    ]

    for i, bug in enumerate(bugs, 1):
        add_bug_report(doc, i, bug)

    doc.add_paragraph()
    doc.add_heading("Задание 3", level=2)
    doc.add_paragraph(
        "Сохранить файл под фамилией студента (например: Отчет_Иванов_ПР13.docx) "
        "и отправить преподавателю на проверку вместе со скриншотами."
    )

    out = "/workspace/pr13_bugreports/Отчет_Практическая_13_Багрепорты.docx"
    doc.save(out)
    print("OK:", out)


if __name__ == "__main__":
    main()
