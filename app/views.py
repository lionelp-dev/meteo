from inertia import render


def index(request):
    return render(
        request,
        "Home",
        props={
            "title": "Meteo",
            "message": "Hello World!",
        },
    )
